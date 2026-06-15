const { Schema, model, Types } = require('mongoose');

const apiKeySchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, default: 'Default key' },
    key: { type: String, required: true, unique: true, index: true },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

apiKeySchema.virtual('id').get(function () { return this._id.toString(); });
apiKeySchema.set('toJSON', { virtuals: true });
apiKeySchema.set('toObject', { virtuals: true });

// Mask the key for listings — show first 7 and last 4 chars
apiKeySchema.methods.maskedJSON = function () {
  const obj = this.toObject();
  if (!obj.revoked && obj.key) {
    obj.key = obj.key.slice(0, 7) + '•'.repeat(20) + obj.key.slice(-4);
  }
  return obj;
};

module.exports = model('ApiKey', apiKeySchema);
