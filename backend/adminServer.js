const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./db');

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
// Auth
// -----------------------------------------------------------------------------
const JWT_SECRET = process.env.JWT_SECRET || 'gsfs-dev-secret-change-me-in-production';

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
      req.user = { id: payload.sub, role: payload.role, email: payload.email };
      next();
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
// Blogs
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

// -----------------------------------------------------------------------------
// Services
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Case Studies
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Jobs
// -----------------------------------------------------------------------------
app.get('/api/jobs', authMiddleware(false), async (req, res) => {
  try {
    const { featured, q } = req.query;
    let list = Job.find();
    if (!req.user || req.user.role !== 'admin') list = list.where({ active: true });
    if (featured === 'true') list = list.where({ featured: true });
    if (q) list = list.or([
      { title: new RegExp(q, 'i') },
      { company: new RegExp(q, 'i') },
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

// -----------------------------------------------------------------------------
// Contacts
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Users
// -----------------------------------------------------------------------------
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
// Start
// -----------------------------------------------------------------------------
const ADMIN_PORT = process.env.ADMIN_PORT || 5001;
connectDB().then(() => {
  app.listen(ADMIN_PORT, () => console.log(`Admin server running on port ${ADMIN_PORT}`));
}).catch((err) => {
  console.error('[admin] MongoDB connection failed:', err.message);
  process.exit(1);
});
