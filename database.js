//const Database = require('better-sqlite3');
//const db = new Database('ecommerce.db');

// Create the products table if it doesn't exist
//db.prepare(`
  //CREATE TABLE IF NOT EXISTS products (
   // id INTEGER PRIMARY KEY AUTOINCREMENT,
    //name TEXT,
    //price INTEGER,
    //inStock BOOLEAN
  //)
//`).run();


//const count = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;

//if (count === 0) {
  //const insert = db.prepare('INSERT INTO products (name, price, inStock) VALUES (?, ?, ?)');
  //insert.run('iPhone 15 Pro', 23999, 1);
  //insert.run('Samsung Galaxy S24', 21999, 0);
//}

//module.exports = db;