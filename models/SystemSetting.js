const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema({
  finePerDay: { type: Number, default: 5 },
  defaultBorrowDurationDays: { type: Number, default: 7 },
  broadcastMessage: { 
    type: String, 
    default: 'CampusShare is live for Fall 2026! Return items on time to avoid fines.' 
  },
  allowStudentUploads: { type: Boolean, default: true },
  requireApproval: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
