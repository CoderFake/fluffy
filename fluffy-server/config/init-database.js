const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Khởi tạo cơ sở dữ liệu
 * @param {mongoose.Connection} db - Kết nối MongoDB
 */
async function initializeDatabase(db) {
  try {
    console.log('Bắt đầu khởi tạo cơ sở dữ liệu...');

    // Danh sách các collection cần tạo
    const collections = [
      // Collection User
      {
        name: 'users',
        schema: {
          email: { type: String, required: true, unique: true },
          password: { type: String, required: true },
          user_cookies: { type: String, unique: true },
          role: { type: String, enum: ['user', 'admin'], default: 'user' },
          active: { type: Boolean, default: true },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { email: 1 }, unique: true },
          { key: { user_cookies: 1 }, unique: true }
        ]
      },
      
      // Collection User_Login
      {
        name: 'user_logins',
        schema: {
          User_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
          email: { type: String, required: true },
          password: { type: String, required: true },
          name: { type: String },
          OAuth_id: { type: String },
          Provider: { type: String },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { User_id: 1 }, unique: true },
          { key: { email: 1 }, unique: true }
        ]
      },
      
      // Collection Address
      {
        name: 'addresses',
        schema: {
          address_id: { type: String, required: true, unique: true },
          user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
          receiver_phone_number: { type: String, required: true },
          address_detail: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { address_id: 1 }, unique: true },
          { key: { user_id: 1 } }
        ]
      },
      
      // Collection Category
      {
        name: 'categories',
        schema: {
          category_id: { type: String, required: true, unique: true },
          name: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { category_id: 1 }, unique: true }
        ]
      },
      
      // Collection Product
      {
        name: 'products',
        schema: {
          product_id: { type: Number, required: true, unique: true },
          category_id: { type: String, required: true, ref: 'categories' },
          name: { type: String, required: true },
          color: { 
            selected_colors: [String]
          },
          size: { 
            available_sizes: [String]
          },
          price: { type: Number, required: true },
          description: { type: String },
          stock: { type: Number, default: 0 },
          average_rating: { type: Number, default: 0 },
          images: [String],
          image: String,
          pricing: {
            original_price: String,
            discount_percentage: String
          },
          collection: String,
          rating: Number,
          created_at: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { product_id: 1 }, unique: true },
          { key: { category_id: 1 } }
        ]
      },
      
      // Collection Cart
      {
        name: 'carts',
        schema: {
          cart_id: { type: String, required: true, unique: true },
          user_cookies: { type: String, required: true, ref: 'users' },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { cart_id: 1 }, unique: true },
          { key: { user_cookies: 1 } }
        ]
      },
      
      // Collection CartItem
      {
        name: 'cart_items',
        schema: {
          cart_item_id: { type: String, required: true, unique: true },
          cart_id: { type: String, required: true, ref: 'carts' },
          product_id: { type: Number, required: true, ref: 'products' },
          quantity: { type: Number, required: true, default: 1 },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { cart_item_id: 1 }, unique: true },
          { key: { cart_id: 1 } },
          { key: { product_id: 1 } }
        ]
      },
      
      // Collection Order
      {
        name: 'orders',
        schema: {
          order_id: { type: String, required: true, unique: true },
          user_cookies: { type: String, required: true, ref: 'users' },
          shipping_address: { type: String, required: true },
          total_amount: { type: Number, required: true },
          order_status: { type: String, required: true, default: 'pending' },
          voucher_code: { type: String, ref: 'vouchers' },
          created_at: { type: Date, default: Date.now },
          address_id: { type: String, ref: 'addresses' }
        },
        indexes: [
          { key: { order_id: 1 }, unique: true },
          { key: { user_cookies: 1 } },
          { key: { voucher_code: 1 } }
        ]
      },
      
      // Collection OrderItem
      {
        name: 'order_items',
        schema: {
          order_item_id: { type: String, required: true, unique: true },
          order_id: { type: String, required: true, ref: 'orders' },
          product_id: { type: Number, required: true, ref: 'products' },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { order_item_id: 1 }, unique: true },
          { key: { order_id: 1 } },
          { key: { product_id: 1 } }
        ]
      },
      
      // Collection Invoice
      {
        name: 'invoices',
        schema: {
          invoice_id: { type: String, required: true, unique: true },
          order_id: { type: String, required: true, ref: 'orders' },
          invoice_date: { type: Date, required: true, default: Date.now },
          payment_status: { type: String, required: true, default: 'pending' },
          payment_method: { type: String },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { invoice_id: 1 }, unique: true },
          { key: { order_id: 1 } }
        ]
      },
      
      // Collection Voucher
      {
        name: 'vouchers',
        schema: {
          voucher_code: { type: String, required: true, unique: true },
          discount_type: { type: String, required: true },
          discount_value: { type: Number, required: true },
          valid_from: { type: Date, required: true },
          valid_until: { type: Date, required: true },
          quantity: { type: Number, default: 1 },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { voucher_code: 1 }, unique: true }
        ]
      },
      
      // Collection Review
      {
        name: 'reviews',
        schema: {
          review_id: { type: String, required: true, unique: true },
          user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
          product_id: { type: Number, required: true, ref: 'products' },
          rating: { type: Number, required: true },
          text: { type: String },
          video: { type: String },
          image_url: { type: String },
          created_at: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { review_id: 1 }, unique: true },
          { key: { user_id: 1 } },
          { key: { product_id: 1 } }
        ]
      },
      
      // Collection Wishlist
      {
        name: 'wishlists',
        schema: {
          wishlist_id: { type: String, required: true, unique: true },
          user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
          product_id: { type: Number, required: true, ref: 'products' },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
        },
        indexes: [
          { key: { wishlist_id: 1 }, unique: true },
          { key: { user_id: 1 } },
          { key: { product_id: 1 } }
        ]
      }
    ];

    // Kiểm tra và tạo các collection
    for (const collection of collections) {
      // Kiểm tra xem collection đã tồn tại chưa
      const collectionExists = await db.collection(collection.name).findOne();
      
      if (!collectionExists) {
        console.log(`Tạo collection ${collection.name}...`);
        await db.createCollection(collection.name);
        
        // Tạo các index
        if (collection.indexes && collection.indexes.length > 0) {
          for (const index of collection.indexes) {
            await db.collection(collection.name).createIndex(index.key, { unique: index.unique || false });
          }
        }
      } else {
        console.log(`Collection ${collection.name} đã tồn tại, kiểm tra cập nhật...`);
        
        // Kiểm tra và thêm các cột mới nếu cần
        const currentSchema = await getCollectionSchema(db, collection.name);
        const schemaKeys = Object.keys(collection.schema);
        
        for (const key of schemaKeys) {
          if (!currentSchema.hasOwnProperty(key)) {
            console.log(`Thêm cột mới "${key}" vào collection ${collection.name}`);
            
            // Thêm cột mới với giá trị mặc định
            await db.collection(collection.name).updateMany(
              {}, 
              { $set: { [key]: getDefaultValue(collection.schema[key]) } }
            );
          }
        }
      }
    }

    // Tạo dữ liệu mẫu cho admin nếu chưa có
    const adminUser = await db.collection('users').findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Tạo tài khoản admin mẫu...');
      
      // Tạo mật khẩu hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      
      // Thêm admin vào collection users
      const adminId = new mongoose.Types.ObjectId();
      await db.collection('users').insertOne({
        _id: adminId,
        email: 'admin@example.com',
        password: hashedPassword,
        user_cookies: generateUniqueId(),
        role: 'admin',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Thêm thông tin đăng nhập cho admin
      await db.collection('user_logins').insertOne({
        User_id: adminId,
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Đã tạo tài khoản admin mẫu với email: admin@example.com, mật khẩu: 123456');
    }
    
    // Tạo dữ liệu mẫu cho người dùng thường nếu chưa có
    const normalUser = await db.collection('users').findOne({ email: 'user@example.com' });
    
    if (!normalUser) {
      console.log('Tạo tài khoản người dùng mẫu...');
      
      // Tạo mật khẩu hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      
      // Thêm người dùng vào collection users
      const userId = new mongoose.Types.ObjectId();
      await db.collection('users').insertOne({
        _id: userId,
        email: 'user@example.com',
        password: hashedPassword,
        user_cookies: generateUniqueId(),
        role: 'user',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Thêm thông tin đăng nhập cho người dùng
      await db.collection('user_logins').insertOne({
        User_id: userId,
        email: 'user@example.com',
        password: hashedPassword,
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Đã tạo tài khoản người dùng mẫu với email: user@example.com, mật khẩu: 123456');
    }

    // Kiểm tra danh mục sản phẩm mẫu
    const categoryExists = await db.collection('categories').findOne();
    
    if (!categoryExists) {
      console.log('Tạo danh mục sản phẩm mẫu...');
      
      const categories = [
        {
          category_id: 'gau-bong',
          name: 'Gấu bông',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          category_id: 'thu-bong',
          name: 'Thú bông',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          category_id: 'phu-kien',
          name: 'Phụ kiện',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await db.collection('categories').insertMany(categories);
      console.log('Đã tạo các danh mục sản phẩm mẫu');
    }

    console.log('Khởi tạo cơ sở dữ liệu hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi khởi tạo cơ sở dữ liệu:', error);
    throw error;
  }
}

/**
 * Lấy cấu trúc schema hiện tại của collection
 * @param {mongoose.Connection} db - Kết nối MongoDB
 * @param {string} collectionName - Tên collection
 * @returns {Object} Schema hiện tại
 */
async function getCollectionSchema(db, collectionName) {
  // Lấy một document mẫu để xem cấu trúc
  const sampleDoc = await db.collection(collectionName).findOne();
  
  if (!sampleDoc) {
    return {};
  }
  
  // Xây dựng schema từ document mẫu
  return Object.keys(sampleDoc).reduce((schema, key) => {
    if (key !== '_id') {
      schema[key] = typeof sampleDoc[key];
    }
    return schema;
  }, {});
}

/**
 * Lấy giá trị mặc định dựa vào kiểu dữ liệu
 * @param {Object} schemaField - Định nghĩa trường trong schema
 * @returns {any} Giá trị mặc định
 */
function getDefaultValue(schemaField) {
  if (schemaField.default !== undefined) {
    return schemaField.default;
  }
  
  switch (schemaField.type) {
    case String:
      return '';
    case Number:
      return 0;
    case Boolean:
      return false;
    case Date:
      return new Date();
    case Array:
    case [String]:
    case [Number]:
      return [];
    case Object:
      return {};
    default:
      return null;
  }
}

/**
 * Tạo ID duy nhất
 * @returns {string} ID duy nhất
 */
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = initializeDatabase;