const ServiceRequest = require('../models/ServiceRequest');
const Product = require('../models/Product');

exports.getServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ userId: req.user.userId })
      .populate('productId', 'name brand')
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ productId: req.params.productId, userId: req.user.userId })
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createServiceRequest = async (req, res) => {
  try {
    const { productId, issue, notes } = req.body;
    
    // Verify product belongs to user
    const product = await Product.findOne({ _id: productId, userId: req.user.userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const request = new ServiceRequest({
      productId,
      userId: req.user.userId,
      issue,
      notes
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateServiceRequest = async (req, res) => {
  try {
    const { status, cost, notes } = req.body;
    
    const request = await ServiceRequest.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!request) return res.status(404).json({ message: 'Service request not found' });

    if (status) request.status = status;
    if (cost !== undefined) request.cost = cost;
    if (notes) request.notes = notes;

    if (status === 'Completed' && !request.completedDate) {
      request.completedDate = new Date();
    }

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!request) return res.status(404).json({ message: 'Service request not found' });
    res.json({ message: 'Service request deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
