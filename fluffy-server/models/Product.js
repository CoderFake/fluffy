const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    product_id: Number,
    product_name: String,
    pricing: {
        original_price: String,
        discount_percentage: String
    },
    images: [String],
    image: String,
    color: {
        selected_colors: [String]
    },
    size: {
        available_sizes: [String]
    },
    rating: Number,
    description: String,
    collection: String
}, { 
    strict: false,
    collection: 'products' // Chỉ định rõ tên collection
});

module.exports = mongoose.model('Product', productSchema, 'products');
