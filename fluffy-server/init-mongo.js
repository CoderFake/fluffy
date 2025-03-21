db = db.getSiblingDB('fluffy_store');

// Tạo collection users nếu chưa tồn tại
if (!db.getCollectionNames().includes('users')) {
    db.createCollection('users');
    
    // Tạo admin user mẫu (mật khẩu 123456 đã hash)
    db.users.insertOne({
        email: "admin@example.com",
        password: "$2a$10$X/VvT1KJ0Xn1VjHcIrHnHum9rr.xHx3n/C32VGQhJj1Z5tEQQ2OSm", // hash của "123456"
        user_cookies: "admin_" + new Date().getTime(),
        role: "admin",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    
    // Tạo user thường mẫu (mật khẩu 123456 đã hash)
    db.users.insertOne({
        email: "user@example.com",
        password: "$2a$10$X/VvT1KJ0Xn1VjHcIrHnHum9rr.xHx3n/C32VGQhJj1Z5tEQQ2OSm", // hash của "123456"
        user_cookies: "user_" + new Date().getTime(),
        role: "user",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    
    // Tạo index
    db.users.createIndex({ email: 1 }, { unique: true });
    db.users.createIndex({ user_cookies: 1 }, { unique: true });
}

// Tạo collection user_logins nếu chưa tồn tại
if (!db.getCollectionNames().includes('user_logins')) {
    db.createCollection('user_logins');
    
    // Lấy user_id của admin và user
    const adminUser = db.users.findOne({ email: "admin@example.com" });
    const normalUser = db.users.findOne({ email: "user@example.com" });
    
    // Thêm thông tin đăng nhập cho admin
    if (adminUser) {
        db.user_logins.insertOne({
            User_id: adminUser._id,
            email: "admin@example.com",
            password: adminUser.password,
            name: "Admin",
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    
    // Thêm thông tin đăng nhập cho user
    if (normalUser) {
        db.user_logins.insertOne({
            User_id: normalUser._id,
            email: "user@example.com",
            password: normalUser.password,
            name: "User",
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    
    // Tạo index
    db.user_logins.createIndex({ User_id: 1 }, { unique: true });
    db.user_logins.createIndex({ email: 1 }, { unique: true });
}

// Tạo collection categories nếu chưa tồn tại
if (!db.getCollectionNames().includes('categories')) {
    db.createCollection('categories');
    
    // Thêm danh mục mẫu
    db.categories.insertMany([
        {
            category_id: "gau-bong",
            name: "Gấu bông",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            category_id: "thu-bong",
            name: "Thú bông",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            category_id: "phu-kien",
            name: "Phụ kiện",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
    
    // Tạo index
    db.categories.createIndex({ category_id: 1 }, { unique: true });
}

// Tạo các collection khác nếu cần thiết
const collections = [
    'products',
    'carts',
    'cart_items',
    'orders',
    'order_items',
    'invoices',
    'vouchers',
    'reviews',
    'wishlists',
    'addresses'
];

collections.forEach(collection => {
    if (!db.getCollectionNames().includes(collection)) {
        db.createCollection(collection);
        print(`Đã tạo collection ${collection}`);
    }
});

// Thêm sản phẩm mẫu nếu bảng products còn trống
if (db.products.countDocuments() === 0) {
    // Thêm 3 sản phẩm mẫu
    db.products.insertMany([
        {
            product_id: 1,
            product_name: "Gấu bông Capybara",
            category_id: "thu-bong",
            pricing: {
                original_price: "230,000đ",
                discount_percentage: "10"
            },
            images: [
                "https://res.cloudinary.com/dkci9bzkj/image/upload/v1741704703/capy_%C4%91eo_cap_wz9v6x.jpg",
                "https://res.cloudinary.com/dkci9bzkj/image/upload/v1741704704/capy2_xezphg.jpg"
            ],
            image: "https://res.cloudinary.com/dkci9bzkj/image/upload/v1741704703/capy_%C4%91eo_cap_wz9v6x.jpg",
            color: {
                selected_colors: ["Nâu", "Xanh lá"]
            },
            size: {
                available_sizes: ["35cm", "45cm", "70cm"]
            },
            rating: 5,
            description: "Gấu bông Capybara siêu mềm mại và đáng yêu, làm quà tặng hoàn hảo cho người thân và bạn bè.",
            collection: "Thú bông hoang dã",
            stock: 50,
            created_at: new Date()
        },
        {
            product_id: 2,
            product_name: "Gấu bông Brown Bear",
            category_id: "gau-bong",
            pricing: {
                original_price: "280,000đ",
                discount_percentage: "5"
            },
            images: [
                "https://res.cloudinary.com/dkci9bzkj/image/upload/v1741918429/teddy-bear-gd5d11c179_1280_hcuakb.jpg"
            ],
            image: "https://res.cloudinary.com/dkci9bzkj/image/upload/v1741918429/teddy-bear-gd5d11c179_1280_hcuakb.jpg",
            color: {
                selected_colors: ["Nâu"]
            },
            size: {
                available_sizes: ["40cm", "60cm", "85cm"]
            },
            rating: 4.8,
            description: "Gấu bông Brown Bear chất lượng cao, mềm mại, phù hợp làm quà tặng cho mọi lứa tuổi.",
            collection: "Classic Teddy",
            stock: 35,
            created_at: new Date()
        },
        {
            product_id: 3,
            product_name: "Gấu bông Doraemon",
            category_id: "thu-bong",
            pricing: {
                original_price: "320,000đ",
                discount_percentage: "15"
            },
            images: [
                "https://res.cloudinary.com/dkci9bzkj/image/upload/v1741918432/toy-g3ffecf73c_1280_p5hnr3.jpg"
            ],
            image: "https://res.cloudinary.com/dkci9bzkj/image/upload/v1741918432/toy-g3ffecf73c_1280_p5hnr3.jpg",
            color: {
                selected_colors: ["Xanh"]
            },
            size: {
                available_sizes: ["30cm", "50cm", "80cm"]
            },
            rating: 4.7,
            description: "Gấu bông Doraemon siêu dễ thương, mềm mại với nhiều kích cỡ khác nhau cho bạn lựa chọn.",
            collection: "Cartoon Characters",
            stock: 25,
            created_at: new Date()
        }
    ]);
    
    // Tạo index
    db.products.createIndex({ product_id: 1 }, { unique: true });
    db.products.createIndex({ category_id: 1 });
    
    print("Đã thêm 3 sản phẩm mẫu vào database");
}

print('Khởi tạo MongoDB thành công!');