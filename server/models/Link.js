const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    referrer: { type: String, default: 'direct' },
    browser: { type: String, default: 'unknown' },
    os: { type: String, default: 'unknown' },
    device: { type: String, default: 'desktop' },
  },
  { _id: false }
);

const LinkSchema = new mongoose.Schema(
  {
    shortCode: { type: String, required: true, unique: true, index: true },
    originalUrl: { type: String, required: true },
    title: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    clicks: { type: [ClickSchema], default: [] },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

LinkSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Link', LinkSchema);
