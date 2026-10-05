const Product = require('../models/Product');
const ServiceRequest = require('../models/ServiceRequest');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const products = await Product.find({ userId });
    
    let activeCount = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;
    let expiringSoonList = [];

    products.forEach(p => {
      const status = p.warrantyStatus;
      if (status === 'Active') activeCount++;
      else if (status === 'Expiring Soon') {
        expiringSoonCount++;
        expiringSoonList.push(p);
      }
      else expiredCount++;
    });

    const requests = await ServiceRequest.find({ userId });
    let openServiceRequests = 0;
    let totalServiceCost = 0;

    requests.forEach(r => {
      if (r.status !== 'Completed') openServiceRequests++;
      totalServiceCost += (r.cost || 0);
    });

    const recentServiceRequests = await ServiceRequest.find({ userId })
      .populate('productId', 'name')
      .sort({ requestDate: -1 })
      .limit(5);

    res.json({
      totalProducts: products.length,
      activeCount,
      expiringSoonCount,
      expiredCount,
      openServiceRequests,
      expiringSoonList,
      recentServiceRequests,
      totalServiceCost
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
