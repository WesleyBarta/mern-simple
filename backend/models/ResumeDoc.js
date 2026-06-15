// Mongoose schema for the Resume document. The shape mirrors the helper
// defaults in ./Resume.js (makeEmptyResume) so the wizard and gatekeeper
// continue to work unchanged.

const { Schema, model, Types } = require('mongoose');

const contactSub = new Schema(
  {
    fullName: { type: String, default: '' },
    email:    { type: String, default: '' },
    phone:    { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio:{ type: String, default: '' },
    location: {
      city:    { type: String, default: '' },
      region:  { type: String, default: '' },
      country: { type: String, default: '' },
    },
  },
  { _id: false }
);

const summarySub = new Schema({ text: { type: String, default: '' } }, { _id: false });

const workSub = new Schema(
  {
    id:        { type: String },
    company:   { type: String, default: '' },
    role:      { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate:   { type: String, default: '' },
    current:   { type: Boolean, default: false },
    location:  { type: String, default: '' },
    bullets:   { type: [String], default: [] },
  },
  { _id: false }
);

const educationSub = new Schema(
  {
    id:       { type: String },
    school:   { type: String, default: '' },
    degree:   { type: String, default: '' },
    field:    { type: String, default: '' },
    startDate:{ type: String, default: '' },
    endDate:  { type: String, default: '' },
    gpa:      { type: String, default: '' },
  },
  { _id: false }
);

const skillSub = new Schema(
  {
    id:    { type: String },
    name:  { type: String, default: '' },
    level: { type: String, enum: ['basic', 'intermediate', 'expert', null], default: null },
  },
  { _id: false }
);

const customSub = new Schema(
  {
    id:    { type: String },
    title: { type: String, default: '' },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const resumeSchema = new Schema(
  {
    userId:         { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title:          { type: String, default: 'My Resume' },
    activeTemplate: { type: String, default: 'minimalist' },
    currentStep:    { type: Number, default: 1 },
    isCompleted:    { type: Boolean, default: false },
    useCount:       { type: Number, default: 0 },
    completedAt:    { type: Date, default: null },
    contact:        { type: contactSub, default: () => ({}) },
    summary:        { type: summarySub, default: () => ({}) },
    work:           { type: [workSub], default: [] },
    education:      { type: [educationSub], default: [] },
    skills:         { type: [skillSub], default: [] },
    custom:         { type: [customSub], default: [] },
  },
  { timestamps: true }
);

resumeSchema.virtual('id').get(function () { return this._id.toString(); });
resumeSchema.set('toJSON', { virtuals: true });
resumeSchema.set('toObject', { virtuals: true });

module.exports = model('ResumeDoc', resumeSchema);
