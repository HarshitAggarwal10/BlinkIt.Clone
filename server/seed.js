require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MONGO_URI } = require('./config');
const User = require('./models/User');
const Product = require('./models/Product');

async function seed() {
  await mongoose.connect(MONGO_URI);

  await User.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
  });

  const rider = await User.create({
    name: 'Rider',
    email: 'rider@example.com',
    password: await bcrypt.hash('rider123', 10),
    role: 'rider',
  });

  const products = [
    {
      name: 'Milk 1L',
      description: 'Fresh cow milk',
      category: 'Dairy',
      price: 50,
      mrp: 55,
      images: [],
      stock: 100,
      unit: '1L',
      tags: ['milk', 'dairy'],
    },
    {
      name: 'Bread',
      description: 'Whole wheat bread',
      category: 'Bakery',
      price: 40,
      mrp: 45,
      images: [],
      stock: 50,
      unit: '400g',
      tags: ['bread', 'bakery'],
    },
  ];
  await Product.insertMany(products);

  console.log('Seed complete');
  process.exit();
}

seed();
