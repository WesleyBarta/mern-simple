const { Schema, model } = require('mongoose');

const jobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: 'Remote' },
    salary: { type: String, default: '' },
    type: { type: String, default: 'Full-time' },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

jobSchema.virtual('id').get(function () { return this._id.toString(); });
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = model('Job', jobSchema);
