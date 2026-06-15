// Resume gatekeeper — enforces tier limits, feature gates, and step integrity
// before any resume mutation lands in the database. Returns 4xx with a clear
// error mapping so the React wizard can highlight the offending field.
//
// Now works with Mongoose docs: it normalizes ObjectId comparisons so a
// user._id (ObjectId) matches a resume.userId (ObjectId).

const { tierFor, STEP_REQUIREMENTS, TEMPLATES } = require('../models/Resume')

// Helper: get a string id from a Mongoose doc, lean object, or raw id
function asId(v) {
  if (!v) return null
  if (typeof v === 'string') return v
  if (v.toString) return v.toString()
  return String(v)
}

// Plan limit check — used by the controller before $inc on completion.
// `resumes` should be an array of resume docs (or lean objects) for ALL users;
// we filter to the current user's set inside.
function checkTierLimit(user, resumes) {
  const tier = tierFor(user.plan)
  const userId = asId(user._id) || asId(user.id)
  const myResumes = resumes.filter((r) => asId(r.userId) === userId)
  const totalUses = myResumes.reduce((sum, r) => sum + (r.useCount || 0), 0)
  if (totalUses >= tier.uses) {
    return {
      ok: false,
      status: 403,
      error: `You've used all ${tier.uses} resume generations on the ${(user.plan || 'free').toUpperCase()} plan. Upgrade to Pro (30) or Extra (100) to keep going.`,
      code: 'TIER_LIMIT_REACHED',
      current: totalUses,
      limit: tier.uses,
    }
  }
  return { ok: true, remaining: tier.uses - totalUses }
}

// Feature gate — rejects custom sections, premium templates, or proficiency
// fields for users whose plan doesn't allow them.
function checkFeatureGate(user, patch) {
  const tier = tierFor(user.plan)
  const errs = []

  if (!tier.customSections && Array.isArray(patch.custom) && patch.custom.length > 0) {
    errs.push({
      field: 'custom',
      message: 'Custom sections are a Pro feature. Upgrade to add dynamic sections like Projects, Volunteer Work, or Awards.',
      code: 'GATED_CUSTOM_SECTIONS',
    })
  }

  if (patch.activeTemplate && !tier.templates.includes(patch.activeTemplate)) {
    errs.push({
      field: 'activeTemplate',
      message: `The "${patch.activeTemplate}" template requires a ${patch.activeTemplate === 'executive' ? 'Pro' : 'Extra'} plan.`,
      code: 'GATED_TEMPLATE',
    })
  }

  if (!tier.proficiency && Array.isArray(patch.skills)) {
    for (const s of patch.skills) {
      if (s && s.level && s.level !== 'basic') {
        errs.push({
          field: 'skills[].level',
          message: 'Proficiency levels (intermediate, expert) are a Pro feature.',
          code: 'GATED_PROFICIENCY',
        })
        break
      }
    }
  }

  if (errs.length) {
    return { ok: false, status: 403, error: errs[0].message, code: errs[0].code, errors: errs }
  }
  return { ok: true }
}

// Step integrity — refuses jumps to a step before the required sub-doc is
// valid. `resume` is a plain object (route spreads .toObject() before calling).
function checkStepIntegrity(resume, targetStep) {
  for (let s = 1; s < targetStep; s++) {
    const req = STEP_REQUIREMENTS[s]
    if (!req) continue
    if (req.gated) continue // gating is checked elsewhere
    const doc = resume[req.doc]
    if (!doc) {
      return { ok: false, status: 400, field: req.doc, message: `Step ${s} (${req.doc}) is empty. Fill it in before jumping ahead.`, code: 'STEP_INCOMPLETE' }
    }
    if (Array.isArray(doc)) {
      if (doc.length === 0 && !req.allowEmpty) {
        return { ok: false, status: 400, field: req.doc, message: `Add at least one ${req.doc.slice(0, -1)} entry to continue.`, code: 'STEP_INCOMPLETE' }
      }
      continue
    }
    for (const f of req.fields || []) {
      if (!doc[f] || (typeof doc[f] === 'string' && !doc[f].trim())) {
        return { ok: false, status: 400, field: `${req.doc}.${f}`, message: `${f} is required to advance from step ${s}.`, code: 'STEP_INCOMPLETE' }
      }
    }
  }
  return { ok: true }
}

// Validate the patch payload itself before any state mutation. Keeps the
// shape of a Mongoose validator — checks types, lengths, and required fields.
function validatePatch(patch) {
  const errs = []
  const isStr = (v, max = 500) => typeof v === 'string' && v.length <= max
  const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  if (patch.title !== undefined && !isStr(patch.title, 120)) errs.push({ field: 'title', message: 'Title must be a string under 120 characters.' })

  if (patch.contact) {
    const c = patch.contact
    if (c.fullName !== undefined && !isStr(c.fullName, 120)) errs.push({ field: 'contact.fullName', message: 'Full name must be a string under 120 chars.' })
    if (c.email !== undefined && !isEmail(c.email)) errs.push({ field: 'contact.email', message: 'Email is invalid.' })
    if (c.phone !== undefined && !isStr(c.phone, 40)) errs.push({ field: 'contact.phone', message: 'Phone too long.' })
    if (c.linkedin !== undefined && !isStr(c.linkedin, 300)) errs.push({ field: 'contact.linkedin', message: 'LinkedIn URL too long.' })
    if (c.portfolio !== undefined && !isStr(c.portfolio, 300)) errs.push({ field: 'contact.portfolio', message: 'Portfolio URL too long.' })
  }

  if (patch.summary && patch.summary.text !== undefined && !isStr(patch.summary.text, 4000)) {
    errs.push({ field: 'summary.text', message: 'Summary must be under 4000 characters.' })
  }

  if (Array.isArray(patch.work)) {
    if (patch.work.length > 30) errs.push({ field: 'work', message: 'Too many work entries (max 30).' })
    for (let i = 0; i < patch.work.length; i++) {
      const w = patch.work[i]
      if (!w.company || !isStr(w.company, 120)) errs.push({ field: `work[${i}].company`, message: 'Company required.' })
      if (!w.role || !isStr(w.role, 120)) errs.push({ field: `work[${i}].role`, message: 'Role required.' })
      if (!w.startDate || !isStr(w.startDate, 40)) errs.push({ field: `work[${i}].startDate`, message: 'Start date required.' })
      if (w.bullets && !Array.isArray(w.bullets)) errs.push({ field: `work[${i}].bullets`, message: 'Bullets must be an array.' })
      if (w.bullets && w.bullets.length > 30) errs.push({ field: `work[${i}].bullets`, message: 'Too many bullets (max 30).' })
    }
  }

  if (Array.isArray(patch.education)) {
    if (patch.education.length > 10) errs.push({ field: 'education', message: 'Too many education entries (max 10).' })
    for (let i = 0; i < patch.education.length; i++) {
      const e = patch.education[i]
      if (!e.school || !isStr(e.school, 200)) errs.push({ field: `education[${i}].school`, message: 'School required.' })
    }
  }

  if (Array.isArray(patch.skills)) {
    if (patch.skills.length > 50) errs.push({ field: 'skills', message: 'Too many skills (max 50).' })
    for (let i = 0; i < patch.skills.length; i++) {
      const s = patch.skills[i]
      if (!s.name || !isStr(s.name, 60)) errs.push({ field: `skills[${i}].name`, message: 'Skill name required.' })
      if (s.level && !['basic', 'intermediate', 'expert'].includes(s.level)) {
        errs.push({ field: `skills[${i}].level`, message: 'Level must be basic, intermediate, or expert.' })
      }
    }
  }

  if (Array.isArray(patch.custom)) {
    if (patch.custom.length > 10) errs.push({ field: 'custom', message: 'Too many custom sections (max 10).' })
  }

  if (errs.length) {
    return { ok: false, status: 400, error: errs[0].message, errors: errs }
  }
  return { ok: true }
}

module.exports = {
  checkTierLimit,
  checkFeatureGate,
  checkStepIntegrity,
  validatePatch,
}
