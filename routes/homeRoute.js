const express = require('express');
const { auth } = require('../controllers/authController');
const { getHome } = require('../controllers/homeController');

const router = express.Router();

router.get('/', getHome);

router.use(auth);


module.exports = router;