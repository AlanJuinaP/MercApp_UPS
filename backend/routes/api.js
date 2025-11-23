const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category'); 
const { body, validationResult } = require('express-validator');

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Get all products
router.get('/products', async (req, res) => {
    const products = await Product.find().lean();
    res.json(products); 
});

router.get('/products/:id', async (req, res) => {
    const p = await Product.findById(req.params.id).lean();
    if(!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(p);
});

router.post('/products',
    body('name').notEmpty,
    body('price').isFloat({ gt: 0 }),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const p = new Product(req.body);
        await p.save();
        res.status(201).json(p);
    }
);

router.put('/products/:id',async (req, res) => {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!p) return res.status(404).json({error: 'Producto no encontrado' });
    res.json(p);
});

router.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ok: true });
});

//categories endpoints
router.get('/categories', async (req, res) => {
    const cats = await Category.find().lean();
    res.json(cats);
});

module.exports = router;