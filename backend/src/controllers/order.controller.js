const db = require('../config/db');

// @desc Create a new order
// @route POST /orders
const createOrder = async (req, res, next) => {
  const { customer_name, customer_email, customer_address, customer_city, customer_zip, items } = req.body;

  const client = await db.getClient();

  try {
    // Start Transaction
    await client.query('BEGIN');

    let totalAmount = 0;
    const itemsWithDetails = [];

    // Verify stock and fetch exact product prices
    for (const item of items) {
      const productRes = await client.query(
        'SELECT id, name, price, stock_quantity FROM products WHERE id = $1 FOR UPDATE',
        [item.product_id]
      );

      if (productRes.rows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} does not exist`);
      }

      const product = productRes.rows[0];

      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: "${product.name}". Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
      }

      const itemTotal = parseFloat(product.price) * parseInt(item.quantity, 10);
      totalAmount += itemTotal;

      itemsWithDetails.push({
        product_id: product.id,
        name: product.name,
        quantity: item.quantity,
        price_at_purchase: parseFloat(product.price)
      });
    }

    // Insert Order record
    const orderInsertRes = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_address, customer_city, customer_zip, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
       RETURNING *`,
      [customer_name, customer_email, customer_address, customer_city, customer_zip, totalAmount]
    );

    const newOrder = orderInsertRes.rows[0];

    // Insert Order Items and Update Product Stocks
    for (const item of itemsWithDetails) {
      // Write item to order_items
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [newOrder.id, item.product_id, item.quantity, item.price_at_purchase]
      );

      // Decrement product stock
      await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // Commit Transaction
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: newOrder.id,
      order: {
        ...newOrder,
        items: itemsWithDetails
      }
    });

  } catch (error) {
    // Rollback on any failure
    await client.query('ROLLBACK');
    console.error('Checkout transaction aborted:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Checkout process failed'
    });
  } finally {
    // Release client back to pool
    client.release();
  }
};

// @desc Get all orders (admin only)
// @route GET /orders
const getOrders = async (req, res, next) => {
  try {
    // Fetch orders alongside nested items
    const ordersRes = await db.query('SELECT * FROM orders ORDER BY id DESC');
    const orders = ordersRes.rows;

    // Fetch related items for each order
    for (const order of orders) {
      const itemsRes = await db.query(
        `SELECT oi.id, oi.product_id, oi.quantity, oi.price_at_purchase, p.name as product_name, p.image_url
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      order.items = itemsRes.rows;
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders
};
