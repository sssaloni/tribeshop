const db = require('../config/db');

// @desc Get all products
// @route GET /products
const getProducts = async (req, res, next) => {
  const { category } = req.query;

  try {
    let queryText = 'SELECT * FROM products ORDER BY id DESC';
    let params = [];

    if (category) {
      queryText = 'SELECT * FROM products WHERE category = $1 ORDER BY id DESC';
      params = [category];
    }

    const result = await db.query(queryText, params);
    res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get product by id
// @route GET /products/:id
const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create a new product
// @route POST /products
const createProduct = async (req, res, next) => {
  const { name, description, price, image_url, category, stock_quantity } = req.body;

  try {
    const queryText = `
      INSERT INTO products (name, description, price, image_url, category, stock_quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const params = [
      name,
      description || '',
      parseFloat(price),
      image_url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
      category,
      parseInt(stock_quantity, 10)
    ];

    const result = await db.query(queryText, params);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update product by id
// @route PUT /products/:id
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, image_url, category, stock_quantity } = req.body;

  try {
    // Check if product exists
    const checkProduct = await db.query('SELECT id FROM products WHERE id = $1', [id]);
    if (checkProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`
      });
    }

    const queryText = `
      UPDATE products
      SET name = $1, description = $2, price = $3, image_url = $4, category = $5, stock_quantity = $6
      WHERE id = $7
      RETURNING *
    `;
    const params = [
      name,
      description || '',
      parseFloat(price),
      image_url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
      category,
      parseInt(stock_quantity, 10),
      id
    ];

    const result = await db.query(queryText, params);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete product by id
// @route DELETE /products/:id
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const checkProduct = await db.query('SELECT id FROM products WHERE id = $1', [id]);
    if (checkProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`
      });
    }

    await db.query('DELETE FROM products WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
