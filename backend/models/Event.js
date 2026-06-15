const { Schema, model, Types } = require('mongoose');

const eventSchema = new Schema(
  {
    type: { type: String, required: true, index: true },
    userId: { type: Types.ObjectId, ref: 'User', default: null, index: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    at: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

eventSchema.virtual('id').get(function () { return this._id.toString(); });
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = model('Event', eventSchema);
