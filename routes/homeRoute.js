const express = require('express');
const { auth } = require('../controllers/authController');
const { getHome } = require('../controllers/homeController');

const router = express.Router();

router.use(auth);

router.get('/', getHome);

module.exports = router;