const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/auth.controller');
const { validateLogin: loginVal } = require('../middleware/validator.middleware');

router.post('/login', loginVal, loginAdmin);

module.exports = router;
