const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  resourceName: { type: String, required: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowerName: { type: String, required: true },
  borrowerEmail: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  borrowDate: { type: Date, required: true },
  expectedReturnDate: { type: Date, required: true },
  purpose: { type: String, required: true },
  notes: { type: String, default: '' },
  agreementAccepted: { type: Boolean, required: true, default: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Borrowed', 'Returned', 'Overdue'],
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);
