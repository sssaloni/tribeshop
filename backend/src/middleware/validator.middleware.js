// Input Validation Middleware

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = {};

  if (!username || typeof username !== 'string' || username.trim() === '') {
    errors.username = 'Username is required';
  }
  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, category, stock_quantity } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.name = 'Product name is required';
  }

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
    errors.price = 'Price must be a positive number';
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.category = 'Category is required';
  }

  if (stock_quantity === undefined || stock_quantity === null || isNaN(Number(stock_quantity)) || Number(stock_quantity) < 0) {
    errors.stock_quantity = 'Stock quantity must be a non-negative integer';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { customer_name, customer_email, customer_address, customer_city, customer_zip, items } = req.body;
  const errors = {};

  if (!customer_name || typeof customer_name !== 'string' || customer_name.trim() === '') {
    errors.customer_name = 'Customer name is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer_email || !emailRegex.test(customer_email)) {
    errors.customer_email = 'Valid customer email is required';
  }

  if (!customer_address || typeof customer_address !== 'string' || customer_address.trim() === '') {
    errors.customer_address = 'Address is required';
  }

  if (!customer_city || typeof customer_city !== 'string' || customer_city.trim() === '') {
    errors.customer_city = 'City is required';
  }

  if (!customer_zip || typeof customer_zip !== 'string' || customer_zip.trim() === '') {
    errors.customer_zip = 'ZIP code is required';
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.items = 'Order must contain at least one item';
  } else {
    items.forEach((item, index) => {
      if (!item.product_id || isNaN(Number(item.product_id))) {
        errors[`items[${index}].product_id`] = 'Valid Product ID is required';
      }
      if (!item.quantity || isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
        errors[`items[${index}].quantity`] = 'Quantity must be a positive integer';
      }
    });
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  next();
};

module.exports = {
  validateLogin,
  validateProduct,
  validateOrder
};
