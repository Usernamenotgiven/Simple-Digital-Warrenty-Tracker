const Product = require('../models/Product');
const ServiceRequest = require('../models/ServiceRequest');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = { userId: req.user.userId };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // Filter by status if provided (since it's a virtual, we filter after fetching)
    let filteredProducts = products;
    if (status) {
      filteredProducts = products.filter(p => p.warrantyStatus === status);
    }

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      userId: req.user.userId
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete associated service requests
    await ServiceRequest.deleteMany({ productId: req.params.id });
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
