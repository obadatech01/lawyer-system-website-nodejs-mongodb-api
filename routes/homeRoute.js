const express = require('express');
const { auth } = require('../controllers/authController');
const { getHome, getReport } = require('../controllers/homeController');

const router = express.Router();

router.get('/report', getReport);
router.use(auth);

router.get('/', getHome);

module.exports = router;