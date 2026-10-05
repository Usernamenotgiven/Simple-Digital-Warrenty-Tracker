const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String },
  serialNo: { type: String },
  category: { 
    type: String, 
    enum: ['Electronics', 'Appliance', 'Furniture', 'Vehicle', 'Other'],
    default: 'Other'
  },
  purchaseDate: { type: Date, required: true },
  warrantyMonths: { type: Number, required: true },
  price: { type: Number },
  seller: { type: String },
  invoiceNo: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('warrantyEndDate').get(function() {
  if (!this.purchaseDate || !this.warrantyMonths) return null;
  const endDate = new Date(this.purchaseDate);
  endDate.setMonth(endDate.getMonth() + this.warrantyMonths);
  return endDate;
});

productSchema.virtual('daysRemaining').get(function() {
  const endDate = this.warrantyEndDate;
  if (!endDate) return 0;
  const diffTime = endDate.getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

productSchema.virtual('warrantyStatus').get(function() {
  const days = this.daysRemaining;
  if (days < 0) return 'Expired';
  if (days <= 30) return 'Expiring Soon';
  return 'Active';
});

module.exports = mongoose.model('Product', productSchema);
