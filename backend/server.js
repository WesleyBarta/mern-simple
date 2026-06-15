const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const { connectDB } = require('./db');
const { tierFor, makeEmptyResume, applyPatch, TIER_LIMITS } = require('./models/Resume');
const { checkTierLimit, checkFeatureGate, checkStepIntegrity, validatePatch } = require('./middleware/resumeGatekeeper');

const Blog = require('./models/Blog');
const Service = require('./models/Service');
const Project = require('./models/Project');
const CaseStudy = require('./models/CaseStudy');
const Job = require('./models/Job');
const Contact = require('./models/Contact');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// -----------------------------------------------------------------------------
// Auth helpers
// -----------------------------------------------------------------------------
const JWT_SECRET = process.env.JWT_SECRET || 'gsfs-dev-secret-change-me-in-production';
const TOKEN_TTL = '7d';

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function publicUser(u) {
  if (!u) return null;
  const obj = u.toJSON ? u.toJSON() : u;
  const { passwordHash, ...rest } = obj;
  return rest;
}

function authMiddleware(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const m = header.match(/^Bearer\s+(.+)$/i);
    if (!m) {
      if (required) return res.status(401).json({ error: 'Missing or invalid Authorization header' });
      req.user = null;
      return next();
    }
    try {
      const payload = jwt.verify(m[1], JWT_SECRET);
      User.findById(payload.sub).then((user) => {
        if (!user) {
          if (required) return res.status(401).json({ error: 'User not found' });
          req.user = null;
          return next();
        }
        req.user = user;
        next();
      }).catch(() => {
        if (required) return res.status(401).json({ error: 'User not found' });
        req.user = null;
        next();
      });
    } catch (err) {
      if (required) return res.status(401).json({ error: 'Invalid or expired token' });
      req.user = null;
      next();
    }
  };
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Requires ${role} role` });
    }
    next();
  };
}

// -----------------------------------------------------------------------------
// Routes — auth
// -----------------------------------------------------------------------------
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const lower = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: lower });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }
    const isAdmin = lower === 'admin@gsfsgroup.demo';
    const user = await User.create({
      name: String(name).trim(),
      email: lower,
      passwordHash: await bcrypt.hash(password, 10),
      role: isAdmin ? 'admin' : 'user',
      plan: 'free',
    });
    const token = signToken(user);
    res.status(201).json({ user: publicUser(user), token });
  } catch (err) {
    console.error('[signup]', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const lower = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: lower });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken(user);
    res.json({ user: publicUser(user), token });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware(), (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.patch('/api/auth/me', authMiddleware(), async (req, res) => {
  const { name } = req.body || {};
  if (name !== undefined) {
    if (!String(name).trim()) return res.status(400).json({ error: 'Name cannot be empty' });
    req.user.name = String(name).trim();
    await req.user.save();
  }
  res.json({ user: publicUser(req.user) });
});

// -----------------------------------------------------------------------------
// Routes — public content (blogs, services, projects, case studies, jobs)
// -----------------------------------------------------------------------------
app.get('/api/blogs', authMiddleware(false), async (req, res) => {
  try {
    const { q } = req.query;
    let list = Blog.find();
    if (!req.user || req.user.role !== 'admin') list = list.where({ active: true });
    if (q) list = list.or([{ title: new RegExp(q, 'i') }, { tag: new RegExp(q, 'i') }]);
    const blogs = await list.sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/blogs/:id', authMiddleware(false), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ blog });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/services', authMiddleware(false), async (req, res) => {
  try {
    let list = Service.find();
    if (!req.user || req.user.role !== 'admin') list = list.where({ active: true });
    const services = await list.sort({ order: 1 });
    res.json({ services });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/services/:id', authMiddleware(false), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ service });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects', authMiddleware(false), async (req, res) => {
  try {
    const { featured } = req.query;
    let list = Project.find();
    if (!req.user || req.user.role !== 'admin') list = list.where({ active: true });
    if (featured === 'true') list = list.where({ featured: true });
    const projects = await list.sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects/:id', authMiddleware(false), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/case-studies', authMiddleware(false), async (req, res) => {
  try {
    const { featured } = req.query;
    let list = CaseStudy.find();
    if (!req.user || req.user.role !== 'admin') list = list.where({ active: true });
    if (featured === 'true') list = list.where({ featured: true });
    const caseStudies = await list.sort({ createdAt: -1 });
    res.json({ caseStudies });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/case-studies/:id', authMiddleware(false), async (req, res) => {
  try {
    const cs = await CaseStudy.findById(req.params.id);
    if (!cs) return res.status(404).json({ error: 'Case study not found' });
    res.json({ caseStudy: cs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/jobs', authMiddleware(false), async (req, res) => {
  try {
    const { featured, q } = req.query;
    let list = Job.find();
    if (!req.user || req.user.role !== 'admin') list = list.where({ active: true });
    if (featured === 'true') list = list.where({ featured: true });
    if (q) list = list.or([
      { title: new RegExp(q, 'i') },
      { company: new RegExp(q, 'i') },
      { tags: new RegExp(q, 'i') },
    ]);
    const jobs = await list.sort({ postedAt: -1 });
    res.json({ jobs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/jobs/:id', authMiddleware(false), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/jobs/:id/apply', authMiddleware(), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -----------------------------------------------------------------------------
// Routes — contact (public)
// -----------------------------------------------------------------------------
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message are required' });
    await Contact.create({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject || 'general',
      message: String(message).slice(0, 2000),
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('[contact]', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// -----------------------------------------------------------------------------
// Routes — resume engine
// -----------------------------------------------------------------------------
const { Resume } = require('./models/Resume');

app.get('/api/resumes', authMiddleware(), async (req, res) => {
  try {
    const tier = tierFor(req.user.plan);
    const resumes = await Resume.find({ userId: req.user._id.toString() });
    const totalUses = resumes.reduce((s, r) => s + (r.useCount || 0), 0);
    res.json({
      resumes,
      tier: { plan: req.user.plan || 'free', ...tier, used: totalUses, remaining: Math.max(0, tier.uses - totalUses) },
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/resumes', authMiddleware(), async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id.toString() });
    const limit = checkTierLimit(req.user, resumes);
    if (!limit.ok) return res.status(limit.status).json({ error: limit.error, code: limit.code });
    const resume = await Resume.create(makeEmptyResume(req.user._id.toString(), req.body?.title));
    res.status(201).json({ resume });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/resumes/:id', authMiddleware(), async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.userId !== req.user._id.toString()) return res.status(404).json({ error: 'Resume not found' });
    res.json({ resume });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/resumes/:id', authMiddleware(), async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.userId !== req.user._id.toString()) return res.status(404).json({ error: 'Resume not found' });
    const validation = validatePatch(req.body);
    if (!validation.ok) return res.status(validation.status).json({ error: validation.error, errors: validation.errors });
    const gate = checkFeatureGate(req.user, req.body);
    if (!gate.ok) return res.status(gate.status).json({ error: gate.error, code: gate.code, errors: gate.errors });
    if (req.body.currentStep) {
      const stepCheck = checkStepIntegrity({ ...resume.toObject(), ...req.body }, Number(req.body.currentStep));
      if (!stepCheck.ok) return res.status(stepCheck.status).json({ error: stepCheck.message, code: stepCheck.code, field: stepCheck.field });
    }
    applyPatch(resume, req.body);
    await resume.save();
    res.json({ resume });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/resumes/:id', authMiddleware(), async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id.toString() });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    await resume.deleteOne();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/resumes/:id/ai', authMiddleware(), async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.userId !== req.user._id.toString()) return res.status(404).json({ error: 'Resume not found' });
    const tier = tierFor(req.user.plan);
    const { field, text, jobDescription } = req.body || {};
    if (!text || !field) return res.status(400).json({ error: 'field and text are required' });
    let enhanced = text;
    const steps = ['Cleaned text & fixed spelling'];
    enhanced = basicCleanup(enhanced);
    if (tier.actionVerbs) {
      enhanced = injectActionVerbs(enhanced);
      steps.push('Injected strong action verbs', 'Rewrote bullets for structure');
    }
    if (tier.jdMatching) {
      if (!jobDescription) return res.status(400).json({ error: 'Extra tier requires a jobDescription for ATS keyword matching.' });
      enhanced = injectATSKeywords(enhanced, jobDescription);
      steps.push('Matched keywords against the provided job description', 'Optimized for ATS systems');
    }
    res.json({ enhanced, steps, tier: req.user.plan || 'free' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/resumes/:id/complete', authMiddleware(), async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id.toString() });
    const limit = checkTierLimit(req.user, resumes);
    if (!limit.ok) return res.status(limit.status).json({ error: limit.error, code: limit.code });
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.userId !== req.user._id.toString()) return res.status(404).json({ error: 'Resume not found' });
    resume.isCompleted = true;
    resume.useCount = (resume.useCount || 0) + 1;
    resume.completedAt = new Date().toISOString();
    await resume.save();
    res.json({ resume, remaining: limit.remaining - 1 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/resumes/parse', authMiddleware(), async (req, res) => {
  try {
    const { filename, contentBase64, mimeType } = req.body || {};
    if (!contentBase64 || !mimeType) return res.status(400).json({ error: 'filename, contentBase64, and mimeType are required' });
    const buffer = Buffer.from(contentBase64, 'base64');
    let text = '';
    if (mimeType.includes('pdf')) {
      const parsed = await pdfParse(buffer);
      text = parsed.text || '';
    } else if (mimeType.includes('word') || filename?.toLowerCase().endsWith('.docx')) {
      const parsed = await mammoth.extractRawText({ buffer });
      text = parsed.value || '';
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Use PDF or DOCX.' });
    }
    const extracted = heuristicParse(text);
    res.json({ text, extracted });
  } catch (e) {
    console.error('[resume parse]', e);
    res.status(500).json({ error: 'Failed to parse the file.' });
  }
});

// ---- AI enhancement helpers ----
function basicCleanup(s) {
  return s
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/(^|[.!?])\s*([a-z])/g, (m, p, c) => p + ' ' + c.toUpperCase())
    .trim();
}

const ACTION_VERBS = ['Spearheaded', 'Orchestrated', 'Engineered', 'Architected', 'Drove', 'Delivered', 'Launched', 'Optimized', 'Scaled', 'Mentored', 'Owned', 'Led'];
function injectActionVerbs(s) {
  const firstWord = s.trim().split(/\s+/)[0] || '';
  const startsWithVerb = ACTION_VERBS.some((v) => v.toLowerCase() === firstWord.toLowerCase());
  if (!startsWithVerb && firstWord) {
    const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
    s = verb + ' ' + s.charAt(0).toLowerCase() + s.slice(1);
  }
  return s;
}

function injectATSKeywords(s, jd) {
  const jdTokens = (jd.toLowerCase().match(/[a-z][a-z+#.\-]{2,}/g) || []);
  const freq = {};
  for (const t of jdTokens) freq[t] = (freq[t] || 0) + 1;
  const missing = Object.entries(freq)
    .filter(([t]) => !s.toLowerCase().includes(t))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t);
  if (missing.length) {
    s = s.trim().replace(/[.!?]?$/, '.') + ' Relevant skills: ' + missing.join(', ') + '.';
  }
  return s;
}

function heuristicParse(text) {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const extracted = {
    fullName: lines[0] || '',
    email: (text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [''])[0],
    phone: (text.match(/(\+?\d[\d\s().-]{7,}\d)/) || [''])[0],
    summary: '',
    work: [],
    education: [],
    skills: [],
  };
  for (const line of lines.slice(0, 25)) {
    if (/^(summary|profile|objective|about)\b/i.test(line)) {
      const idx = lines.indexOf(line);
      extracted.summary = lines.slice(idx + 1, idx + 4).join(' ');
      break;
    }
  }
  const workIdx = lines.findIndex(l => /^experience\b/i.test(l));
  if (workIdx !== -1) {
    const endIdx = lines.findIndex((l, i) => i > workIdx && /^education\b/i.test(l));
    const workLines = lines.slice(workIdx + 1, endIdx !== -1 ? endIdx : lines.length);
    let currentJob = null;
    for (let i = 0; i < workLines.length; i++) {
      const line = workLines[i];
      if (line.includes('|') && /\d{2}\/\d{4}|present/i.test(line)) {
        if (currentJob) extracted.work.push(currentJob);
        const parts = line.split('|').map(p => p.trim());
        currentJob = {
          role: parts[0] || '',
          company: parts[1] || '',
          location: parts[2] || '',
          startDate: (line.match(/\d{2}\/\d{4}/) || [''])[0],
          endDate: '',
          current: /present/i.test(line),
          bullets: [],
        };
        const dates = line.match(/\d{2}\/\d{4}/g) || [];
        if (dates.length >= 2) currentJob.endDate = dates[1];
      } else if (currentJob && line && !line.match(/^(Experience|Education|Skills)/i) && line.length > 10) {
        currentJob.bullets.push(line);
      }
    }
    if (currentJob) extracted.work.push(currentJob);
  }
  const eduIdx = lines.findIndex(l => /^education\b/i.test(l));
  if (eduIdx !== -1) {
    const skillsIdx = lines.findIndex((l, i) => i > eduIdx && /^skills\b/i.test(l));
    const eduLines = lines.slice(eduIdx + 1, skillsIdx !== -1 ? skillsIdx : lines.length);
    for (const line of eduLines) {
      if (/bachelor|master|ph\.?d\.?|university|college/i.test(line)) {
        const degreeMatch = line.match(/(B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|Ph\.?D\.?)/i);
        const fieldMatch = line.match(/in\s+([A-Za-z\s]+)/i);
        const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
        extracted.education.push({
          school: line.split(/[–|]/)[0]?.trim() || '',
          degree: degreeMatch?.[1] || 'Bachelor',
          field: fieldMatch?.[1]?.trim() || '',
          graduationDate: yearMatch?.[1] || '',
        });
      }
    }
  }
  const skillsIdx = lines.findIndex(l => /^skills\b/i.test(l));
  if (skillsIdx !== -1) {
    const nextSectionIdx = lines.findIndex((l, i) => i > skillsIdx && /^experience\b/i.test(l));
    const skillLines = lines.slice(skillsIdx + 1, nextSectionIdx !== -1 ? nextSectionIdx : skillsIdx + 15);
    const skillsText = skillLines.join(' ');
    extracted.skills = skillsText
      .split(/[,;]/)
      .map(s => s.replace(/^[-•*]\s*/, '').trim())
      .filter(s => s.length > 2 && s.length < 60 && !/^\d/.test(s))
      .slice(0, 30)
      .map(name => ({ name, level: 'basic' }));
  }
  return extracted;
}

// -----------------------------------------------------------------------------
// Routes — billing (mock)
// -----------------------------------------------------------------------------
const PLAN_PRICES = { pro: 29, extra: 99 };
app.post('/api/billing/checkout', authMiddleware(), async (req, res) => {
  try {
    const { plan } = req.body || {};
    if (!PLAN_PRICES[plan]) return res.status(400).json({ error: 'Invalid plan' });
    req.user.plan = plan;
    await req.user.save();
    res.json({ user: publicUser(req.user), ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/billing/cancel', authMiddleware(), async (req, res) => {
  try {
    req.user.plan = 'free';
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -----------------------------------------------------------------------------
// Routes — admin CRUD (blogs, services, projects, case-studies, jobs, contacts, users)
// -----------------------------------------------------------------------------

// Blogs — admin write
app.post('/api/blogs', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, authorName, authorRole, authorImage, tag, readTime, date, active } = req.body || {};
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' });
    const existing = await Blog.findOne({ slug });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });
    const blog = await Blog.create({
      title, slug, excerpt, content, image, authorName, authorRole, authorImage,
      tag: tag || 'TECHNOLOGY', readTime: readTime || '5 min read',
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      active: active !== false,
    });
    res.status(201).json({ blog });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/blogs/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ blog });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/blogs/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Services — admin write
app.post('/api/services', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const { title, slug, tagline, description, image, color, features, process, benefits, technologies, projects, clients, active, order } = req.body || {};
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' });
    const existing = await Service.findOne({ slug });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });
    const service = await Service.create({
      title, slug, tagline, description, image, color: color || 'blue',
      features: Array.isArray(features) ? features : [],
      process: Array.isArray(process) ? process : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      technologies: Array.isArray(technologies) ? technologies : [],
      projects: projects || 0, clients: clients || 0,
      active: active !== false, order: order || 0,
    });
    res.status(201).json({ service });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/services/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ service });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/services/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Projects — admin write
app.post('/api/projects', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const { title, slug, tag, client, year, desc, fullDesc, image, tech, results, active, featured } = req.body || {};
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' });
    const existing = await Project.findOne({ slug });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });
    const project = await Project.create({
      title, slug, tag: tag || 'PROJECT', client, year, desc, fullDesc, image,
      tech: Array.isArray(tech) ? tech : [],
      results: Array.isArray(results) ? results : [],
      active: active !== false, featured: Boolean(featured),
    });
    res.status(201).json({ project });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/projects/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/projects/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Case Studies — admin write
app.post('/api/case-studies', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const { title, slug, tag, client, industry, duration, challenge, solution, outcome, image, sections, active, featured } = req.body || {};
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' });
    const existing = await CaseStudy.findOne({ slug });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });
    const caseStudy = await CaseStudy.create({
      title, slug, tag: tag || 'CASE STUDY', client, industry, duration, challenge, solution, outcome, image,
      sections: Array.isArray(sections) ? sections : [],
      active: active !== false, featured: Boolean(featured),
    });
    res.status(201).json({ caseStudy });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/case-studies/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const cs = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cs) return res.status(404).json({ error: 'Case study not found' });
    res.json({ caseStudy: cs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/case-studies/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const cs = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!cs) return res.status(404).json({ error: 'Case study not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Jobs — admin write
app.post('/api/jobs', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const { title, company, location, salary, type, tags, featured, active } = req.body || {};
    if (!title || !company) return res.status(400).json({ error: 'Title and company are required' });
    const job = await Job.create({
      title, company, location: location || 'Remote', salary: salary || '',
      type: type || 'Full-time', tags: Array.isArray(tags) ? tags : [],
      featured: Boolean(featured), active: active !== undefined ? active : true,
    });
    res.status(201).json({ job });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/jobs/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/jobs/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Contacts — admin read/manage
app.get('/api/contacts', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const { read } = req.query;
    let list = Contact.find();
    if (read === 'true') list = list.where({ read: true });
    else if (read === 'false') list = list.where({ read: false });
    const contacts = await list.sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/contacts/:id/read', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ contact });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/contacts/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Users — admin read/manage
app.get('/api/users', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const { q, role } = req.query;
    let list = User.find();
    if (q) list = list.or([{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }]);
    if (role) list = list.where({ role });
    const users = await list.select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/users/:id/role', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body || {};
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Role must be user or admin' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/users/:id', authMiddleware(), requireRole('admin'), async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -----------------------------------------------------------------------------
// Demo route
// -----------------------------------------------------------------------------
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

// -----------------------------------------------------------------------------
// Serve the built React app (production)
// -----------------------------------------------------------------------------
const distDir = path.join(__dirname, '../frontend/dist');
app.use(express.static(distDir));
app.get('*', (req, res, next) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) next();
  });
});

// -----------------------------------------------------------------------------
// Start
// -----------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('[mongo] connection failed:', err.message);
  process.exit(1);
});
