const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Electronics', 'Lab Equipment', 'Sports', 'Photography', 'Other'],
    required: true 
  },
  description: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerName: { type: String, default: 'Campus Admin' },
  ownerDepartment: { type: String, default: 'Information Technology' },
  availability: { 
    type: String, 
    enum: ['Available', 'Borrowed', 'Reserved', 'Maintenance'],
    default: 'Available' 
  },
  condition: { 
    type: String, 
    enum: ['New', 'Good', 'Fair', 'Needs Maintenance'],
    default: 'Good' 
  },
  borrowingInfo: { 
    type: String, 
    default: 'Standard 7-day campus borrowing period. Clean & handle with care.' 
  },
  location: { type: String, default: 'Main Campus Resource Hub' },
  imageUrl: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
