const { Schema, model } = require('mongoose');

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    color: { type: String, default: 'blue' },
    features: { type: [String], default: [] },
    process: { type: [Schema.Types.Mixed], default: [] },
    benefits: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    projects: { type: Number, default: 0 },
    clients: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.virtual('id').get(function () { return this._id.toString(); });
serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

module.exports = model('Service', serviceSchema);
