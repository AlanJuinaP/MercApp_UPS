const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const multer = require('multer');
const {body, validationResult} = require('express-validator');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif/;
        const ext = path.extname(file.originalname).toLowerCase();
        if(allowed.test(ext)) cb(null, true);
        else cb(new Error('Solo se permiten imágenes'));
    }
});

// List products
router.get('/', async (req, res) => {
    const products = await Product.find().lean().populate('categoryId');
    const categories = await Category.find().lean();
    res.render('products/index', { products, categories });
});

// New product form
router.get('/new', async (req, res) => {
    const categories = await Category.find().lean();
    res.render('products/new', { categories });
});

// Create product
router.post('/',
    upload.single('image'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('products/new', { errors: errors.array(), body: req.body });
        }
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock || 0,
            categoryId: req.body.categoryId || null,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
        });
        await product.save();
        res.redirect('/products');
    }
);

//edit form
router.get('/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id).lean();
    const categories = await Category.find().lean();
    res.render('products/edit', { product, categories });
});

// Update product
router.put('/:id',
    upload.single('image'),
    body('name').notEmpty,
    body('price').isFloat({ gt: 0 }),
    async (req, res) => {
        const p = await Product.findById(req.params.id);
        p.name = req.body.name;
        p.description = req.body.description;
        p.price = req.body.price;
        p.stock = req.body.stock || 0;
        p.categoryId = req.body.categoryId || null;
        if(req.file) p,imageUrl = `/uploads/${req.file.filename}`;
        await p.save();
        res.redirect('/products');
    }
);

// Delete product
router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

module.exports = router;