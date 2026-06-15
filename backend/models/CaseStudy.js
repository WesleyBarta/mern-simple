const { Schema, model } = require('mongoose');

const caseStudySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tag: { type: String, default: 'CASE STUDY' },
    client: { type: String, default: '' },
    industry: { type: String, default: '' },
    duration: { type: String, default: '' },
    challenge: { type: String, default: '' },
    solution: { type: String, default: '' },
    outcome: { type: String, default: '' },
    image: { type: String, default: '' },
    sections: { type: [Schema.Types.Mixed], default: [] },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

caseStudySchema.virtual('id').get(function () { return this._id.toString(); });
caseStudySchema.set('toJSON', { virtuals: true });
caseStudySchema.set('toObject', { virtuals: true });

module.exports = model('CaseStudy', caseStudySchema);
