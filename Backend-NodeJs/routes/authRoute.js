const express = require('express');
const router = express.Router();
const { validationMiddleware } = require('../Middleware/validationMiddleware');
const { registerValidation, loginValidation } = require('../Validation/authValidation');
const { register , login } = require('../Controller/authController');

router.post('/register/',validationMiddleware(registerValidation),register);
router.post('/login/',validationMiddleware(loginValidation),login);

module.exports = router;