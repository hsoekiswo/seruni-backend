import db from "./db";

const createUsers = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TEXT DEFAULT (datetime('now)),
    updated_at TEXT DEFAULT (datetime('now))
)`

db.run(createUsers);

const userCount = db.query(`SELECT COUNT(*) AS count FROM users`).get();

if (userCount.count === 0) {
    console.log("Seeding users...");
    const initialUsers = db.prepare(
        `INSERT INTO users (username, password, name, email, phone) VALUES ($username, $password, $name, $email, $phone, $role)`
    )
    const users = [
        {
            'username': 'admin',
            'password': 'password',
            'name': 'Admin',
            'email': 'serunisekarpuri@gmail.com',
            'phone': '08212345',
            'role': 'admin'
        },
        {
            'username': 'hsoekiswo',
            'password': 'password',
            'name': 'Hafizhun Soekiswo',
            'email': 'hsoekiswo@gmail.com',
            'phone': '08212345',
            'role': 'user'
        },
        {
            'username': 'ijun',
            'password': 'ijun123',
            'name': 'Ijun',
            'email': 'ijun@mail.com',
            'phone': '0898765',
            'role': 'user'
        }
    ];
    users.forEach(user => {
        initialUsers.run([user.username, user.password, user.name, user.email, user.phone, user.role]);
    });
}


const createProducts = `CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    image TEXT,
    description TEXT,
    price REAL
)`

db.run(createProducts);

const productCount = db.query("SELECT COUNT(*) AS count FROM products").get();

if (productCount.count === 0) {
  console.log("Seeding products...");
  const initialProducts = db.prepare(
    `INSERT INTO products (name, image, description, price) VALUES (?, ?, ?, ?)`
  );
  const products = [
        {
            name: "Touch For Health - The Complete Edition",
            image: "https://devorss.com/cdn/shop/files/9780875169125_c039adc2-c6ee-4a20-86c1-4f35871552b9.jpg?v=1684360516&width=800",
            description: "The Fundamental text of Energy Kinesiology for balancing muscles, posture, and “Chi” (Life Energy) This is a complete revision and expansion of the fundamental text of Energy Kinesiology.  Includes complete International Kinesiology College curriculum, plus Dr. Thie’s developments from 1990-2005. Integrates Metaphors of Muscles, Meridians and the Five Elements. With over a million copies in print since 1973, “Touch for Health” started a phenomenon that has flourished worldwide and contributed to the emerging profession of Energy Kinesiology, Energy Medicine and Energy Psychology. TFH has been taught in over 100 countries and 23 languages to help balance Posture, Attitude and Vital Energy to develop Wellness, Health Maintenance, Prevention, Relief from Stress, Aches & Pains and enjoyment of vibrant health.",
            price: 300000
        },
        {
            name: "Touch for Health Handy Assessment Chart",
            image: "https://devorss.com/cdn/shop/products/300_11x17-Handy-Assessment-Chart-proof-1.jpg?v=1659989315&width=300",
            description: "The Touch for Health Handy Assessment Chart (11”x17”, 2-sided) folds neatly in half to tuck into your textbook or notebook. You can easily mark and erase laminated chart. This laminated chart contains all the information from the wall chart, plus Pulse Points, and can be easily marked. except no Acupressure Holding Points. Also includes 111 Metaphor Question on reverse: Questions to consider related to imbalances in the muscles, energy Meridians, and 11 categories of the Five Elements provide a rich resource for considering the symbolic meanings of your energy patterns/blocks. Chart 11 x 17 2-sided Laminated",
            price: 35000
        },
        // Example for post:
        // "name": "Kinesiology for Kids",
        // "image": "https://pustakalanalibrary.wordpress.com/wp-content/uploads/2024/06/1.png?w=819",
        // "description": "Kinesiolog memiliki arti 'ilmu tentang gerak tubuh'. Istilah ini juga dipakai untuk mendeskripsikan sebuah bentuk terapi yang menggunakan umpan balik dari otot untuk mencari penyebab ketidakseimbangan pada tubuh dan mengoreksinya dengan metode yang sesuai. Pada anak, kita bisa membantu mereka mengatasi tanda-tanda ketidakseimbangan seperti low energy, craving, atau beragam emosi yang mempengaruhi kenyamanan mereka dalam berkeseharian dengan gerakan-gerakan sederhana.",
        // "price": 550000
        // "id": 4,
        // "name": "Touch for Health Midday-Midnight Law & Five Elements Law Chart",
        // "image": "https://devorss.com/cdn/shop/files/touchforhealthmiddaymidnightchartoriginal9780875167725.jpg?v=1692297791&width=600",
        // "description": "Practical wall size chart for assessing and balancing energy patterns when teaching a group, or sharing with clients.\n\nTFH Midday/Midnight Law & 5 Elements Chart (24”x32”, full color, laminated) Wall chart shows energy flows in the:\n• 24 hour cycle, (Beaver Dam, Spokes, Squares and Triangles)\n• Seasonal/life cycle energy flows of the Five Elements (Shen and Ko cycles).\n• Basic 14 muscle tests, mapped to the peak times of day for their related energy Meridians\n• Alarm points to check for excess energy in the meridians.\n• All the acupressure holding points for balancing Five Element relationships of the meridians.\n• Five Element metaphor wheel showing 50 associated concepts of the 5 elements\n\nLaminated Chart 24x32\"; 5-pack; 5 Charts in one tube\n\n*NOTE: Economy shipping NOT available for this item.",
        // "price": 40000
    ]
  products.forEach((product) => initialProducts.run(product.name, product.image, product.description, product.price));
}

console.log("Seeding completed!");

db.close();