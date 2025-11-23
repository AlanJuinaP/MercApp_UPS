require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mercapp';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

async function seed() {
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    const cats = await Category.insertMany([
        { name: 'Electrónica' },
        { name: 'Ropa' },
        { name: 'Hogar' }
    ]);

    const products = [
        { name: 'Auriculares Bluetooth', description: 'Auriculares con cancelacion de ruido', prices: 45.99, imageUrl: '', categoryId: cats[0]._id, stock: 10 },
        { name: 'Cimiseta Algodon', description: 'Talla M', price: 12.5, imageUrl: '', categoryId: cats[1]._id, stock: 50 },
        { name: 'Lámpara de Mesa', description: 'Lámpara LED ajustable', price: 22.0, imageUrl: '', categoryId: cats[2]._id, stock: 15 }
    ];
    await Product.insertMany(products);

    const pass = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: pass, role: 'admin' });

    console.log('Seed completed');
    mongoose.disconnect();
}
seed();