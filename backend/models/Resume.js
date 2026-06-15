const { Schema, model } = require('mongoose');

const TEMPLATES = ['minimalist', 'executive', 'creative'];
const FREE_TEMPLATES = ['minimalist'];
const PRO_TEMPLATES = ['minimalist', 'executive'];
const EXTRA_TEMPLATES = ['minimalist', 'executive', 'creative'];

const TIER_LIMITS = {
  free:  { uses: 5,   templates: FREE_TEMPLATES,   customSections: false, proficiency: false, jdMatching: false, actionVerbs: false },
  pro:   { uses: 30,  templates: PRO_TEMPLATES,    customSections: true,  proficiency: true,  jdMatching: false, actionVerbs: true  },
  extra: { uses: 100, templates: EXTRA_TEMPLATES,   customSections: true,  proficiency: true,  jdMatching: true,  actionVerbs: true  },
};

function tierFor(plan) {
  return TIER_LIMITS[plan] || TIER_LIMITS.free;
}

const STEP_TITLES = [
  'Source', 'Contact', 'Summary', 'Work History',
  'Education', 'Skills', 'Custom Sections', 'Template', 'Review & Export',
];

const STEP_REQUIREMENTS = {
  2: { doc: 'contact', fields: ['fullName', 'email'] },
  3: { doc: 'summary',  fields: ['text'] },
  4: { doc: 'work',     fields: [], allowEmpty: true },
  5: { doc: 'education',fields: [], allowEmpty: true },
  6: { doc: 'skills',   fields: [], allowEmpty: true },
  7: { doc: 'custom',   fields: [], allowEmpty: true, gated: true },
};

const resumeSchema = new Schema(
  {
    userId:     { type: String, required: true, index: true },
    title:      { type: String, default: 'My Resume' },
    activeTemplate: { type: String, default: 'minimalist' },
    currentStep:    { type: Number, default: 1 },
    isCompleted:    { type: Boolean, default: false },
    useCount:       { type: Number, default: 0 },
    completedAt:     { type: String, default: '' },
    contact: {
      fullName:  { type: String, default: '' },
      email:     { type: String, default: '' },
      phone:     { type: String, default: '' },
      linkedin:  { type: String, default: '' },
      portfolio: { type: String, default: '' },
      location: {
        city:    { type: String, default: '' },
        region:  { type: String, default: '' },
        country: { type: String, default: '' },
      },
    },
    summary: { text: { type: String, default: '' } },
    work: [{
      role:     { type: String, default: '' },
      company:  { type: String, default: '' },
      location: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate:   { type: String, default: '' },
      current:  { type: Boolean, default: false },
      bullets:  { type: [String], default: [] },
    }],
    education: [{
      school:          { type: String, default: '' },
      degree:          { type: String, default: '' },
      field:           { type: String, default: '' },
      graduationDate:  { type: String, default: '' },
    }],
    skills: [{
      name:   { type: String, default: '' },
      level:  { type: String, default: 'basic' },
    }],
    custom: [{
      title: { type: String, default: '' },
      items: { type: [String], default: [] },
    }],
  },
  { timestamps: true }
);

resumeSchema.virtual('id').get(function () { return this._id.toString(); });
resumeSchema.set('toJSON', { virtuals: true });
resumeSchema.set('toObject', { virtuals: true });

function makeEmptyResume(userId, title) {
  return {
    userId,
    title: title || 'My Resume',
    activeTemplate: 'minimalist',
    currentStep: 1,
    isCompleted: false,
    useCount: 0,
    contact: { fullName: '', email: '', phone: '', linkedin: '', portfolio: '', location: { city: '', region: '', country: '' } },
    summary: { text: '' },
    work: [],
    education: [],
    skills: [],
    custom: [],
  };
}

function applyPatch(resume, patch) {
  if (!patch || typeof patch !== 'object') return resume;
  const allowedTop = ['title', 'activeTemplate', 'currentStep', 'isCompleted', 'contact', 'summary', 'work', 'education', 'skills', 'custom'];
  for (const k of allowedTop) {
    if (k in patch) resume[k] = patch[k];
  }
  return resume;
}

module.exports = {
  Resume: model('Resume', resumeSchema),
  TEMPLATES,
  TIER_LIMITS,
  STEP_TITLES,
  STEP_REQUIREMENTS,
  tierFor,
  makeEmptyResume,
  applyPatch,
};
