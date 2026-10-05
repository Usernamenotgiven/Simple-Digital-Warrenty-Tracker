require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const ServiceRequest = require('./models/ServiceRequest');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    await ServiceRequest.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const user = new User({
      name: 'Demo User',
      email: 'demo@test.com',
      password: hashedPassword
    });
    await user.save();

    const today = new Date();
    
    // Active products
    const p1 = new Product({
      userId: user._id,
      name: 'MacBook Pro 14',
      brand: 'Apple',
      model: 'M3 Pro',
      serialNo: 'SN123456',
      category: 'Electronics',
      purchaseDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
      warrantyMonths: 12,
      price: 1999,
      seller: 'Apple Store'
    });
    
    const p2 = new Product({
      userId: user._id,
      name: 'Washing Machine',
      brand: 'Samsung',
      category: 'Appliance',
      purchaseDate: new Date(today.getTime() - 100 * 24 * 60 * 60 * 1000), 
      warrantyMonths: 24,
      price: 599
    });

    // Expiring soon (less than 30 days remaining)
    // Purchase date: 11.5 months ago, warranty 12 months -> ~15 days left
    const p3 = new Product({
      userId: user._id,
      name: 'Smart TV 55"',
      brand: 'LG',
      category: 'Electronics',
      purchaseDate: new Date(today.getTime() - 350 * 24 * 60 * 60 * 1000), 
      warrantyMonths: 12,
      price: 899
    });

    const p4 = new Product({
      userId: user._id,
      name: 'Office Chair',
      brand: 'Herman Miller',
      category: 'Furniture',
      purchaseDate: new Date(today.getTime() - 355 * 24 * 60 * 60 * 1000), 
      warrantyMonths: 12,
      price: 1200
    });

    // Expired
    const p5 = new Product({
      userId: user._id,
      name: 'Electric Scooter',
      brand: 'Xiaomi',
      category: 'Vehicle',
      purchaseDate: new Date(today.getTime() - 400 * 24 * 60 * 60 * 1000), 
      warrantyMonths: 12,
      price: 499
    });

    const p6 = new Product({
      userId: user._id,
      name: 'Microwave Oven',
      brand: 'Panasonic',
      category: 'Appliance',
      purchaseDate: new Date(today.getTime() - 800 * 24 * 60 * 60 * 1000), 
      warrantyMonths: 24,
      price: 150
    });

    await Product.insertMany([p1, p2, p3, p4, p5, p6]);

    const sr1 = new ServiceRequest({
      productId: p1._id,
      userId: user._id,
      issue: 'Screen flickering occasionally',
      status: 'Requested',
      notes: 'Waiting for diagnostic'
    });

    const sr2 = new ServiceRequest({
      productId: p5._id,
      userId: user._id,
      issue: 'Battery not holding charge',
      status: 'Completed',
      completedDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      cost: 120,
      notes: 'Replaced battery pack'
    });

    await ServiceRequest.insertMany([sr1, sr2]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
