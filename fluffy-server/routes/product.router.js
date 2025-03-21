const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// API gốc để kiểm tra router
router.get('/', (req, res) => {
    res.send('Product Router hoạt động tốt');
});

// API lấy tất cả sản phẩm
router.get('/all', async (req, res) => {
    try {
        const products = await mongoose.connection.db.collection('products').find({}).toArray();
        console.log(`Tìm thấy ${products.length} sản phẩm`);
        res.json(products);
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API lấy sản phẩm theo bộ sưu tập (phải đặt trước route /:productId)
router.get('/collection/:collection', async (req, res) => {
    try {
        const collection = req.params.collection;
        const products = await mongoose.connection.db.collection('products').find({ collection: collection }).toArray();
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm nào trong bộ sưu tập này' });
        }
        
        res.json(products);
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm theo bộ sưu tập:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API lấy sản phẩm theo product_id (số nguyên)
router.get('/:productId', async (req, res) => {
    try {
        console.log('Nhận request với productId:', req.params.productId);
        const productId = parseInt(req.params.productId);
        
        if (isNaN(productId)) {
            console.log('ProductId không phải là số:', req.params.productId);
            return res.status(400).json({ message: 'ID sản phẩm phải là số nguyên' });
        }
        
        console.log('Đang tìm sản phẩm với product_id:', productId);
        const product = await mongoose.connection.db.collection('products').findOne({ product_id: productId });
        
        if (!product) {
            console.log('Không tìm thấy sản phẩm với product_id:', productId);
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        
        console.log('Tìm thấy sản phẩm:', product);
        res.json(product);
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm theo product_id:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API lấy sản phẩm liên quan
router.get('/related/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        
        if (isNaN(productId)) {
            return res.status(400).json({ message: 'ID sản phẩm phải là số nguyên' });
        }
        
        // Tìm sản phẩm hiện tại
        const currentProduct = await mongoose.connection.db.collection('products').findOne({ product_id: productId });
        
        if (!currentProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        
        // Tìm sản phẩm trong cùng bộ sưu tập, ngoại trừ sản phẩm hiện tại
        const relatedProducts = await mongoose.connection.db.collection('products').find({
            product_id: { $ne: productId },
            collection: currentProduct.collection
        }).limit(4).toArray();
        
        res.json(relatedProducts);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
