require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const Stripe = require('stripe');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

const app = express();
app.use(cors());
app.use(express.json());

console.log(process.env);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) console.error('MySQL connection failed:', err);
  else console.log('Connected to MySQL');
});

app.get('/test', (req, res) => res.send('API is running...'));

app.get('/api/products', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err)
      console.error('MYSQL ERROR:', err);
       return res.status(500).json({ error: 'err.message' });
    res.json(results);
  });
});

app.post('/api/products', (req, res) => {
  const { name, price, inStock } = req.body;
  if (!name || price == null || inStock == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO products (name, price, inStock) VALUES (?, ?, ?)';
  connection.query(query, [name, price, inStock], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to insert product' });
    res.status(201).json({ message: 'Product created', productId: results.insertId });
  });
});

//  STRIPE CHECKOUT SESSION
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cartItems } = req.body;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
