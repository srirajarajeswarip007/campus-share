const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Resource Damaged', 'Resource Not Returned', 'Misuse', 'Late Return Dispute', 'Other'],
    required: true 
  },
  description: { type: String, required: true },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reporterName: { type: String, required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
  resourceName: { type: String, default: 'N/A' },
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Resolved'],
    default: 'Pending' 
  },
  actionNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
