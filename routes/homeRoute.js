const express = require('express');
const { auth } = require('../controllers/authController');
const { getHome, getReport } = require('../controllers/homeController');

const router = express.Router();

router.use(auth);

router.get('/', getHome);
router.get('/report', getReport);

module.exports = router;