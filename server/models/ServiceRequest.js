const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Requested', 'In Progress', 'Completed'],
    default: 'Requested'
  },
  requestDate: { type: Date, default: Date.now },
  completedDate: { type: Date },
  cost: { type: Number, default: 0 },
  notes: { type: String }
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
