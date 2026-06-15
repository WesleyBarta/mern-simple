const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tag: { type: String, default: 'PROJECT' },
    client: { type: String, default: '' },
    year: { type: String, default: '' },
    desc: { type: String, default: '' },
    fullDesc: { type: String, default: '' },
    image: { type: String, default: '' },
    tech: { type: [String], default: [] },
    results: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.virtual('id').get(function () { return this._id.toString(); });
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports = model('Project', projectSchema);
