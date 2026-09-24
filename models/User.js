const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, default: 'N/A' },
  department: { type: String, required: true, default: 'General' },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Admin'], default: 'Student' },
  membershipStatus: { type: String, default: 'Active Member' },
  joinedDate: { type: Date, default: Date.now },
  avatarUrl: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
