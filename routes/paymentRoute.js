const express = require('express');

const {
  getPayment,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentController');

const { auth, authorizedBy } = require('../controllers/authController');
const { createPaymentValidator, getPaymentValidator, updatePaymentValidator, deletePaymentValidator } = require('../utils/validators/paymentValidator');

const router = express.Router();


router.use(auth);

router.route('/').get(getPayments).post(authorizedBy("محاسب", "محامي", "مدير"), createPaymentValidator, createPayment);
router.route('/:id').get(getPaymentValidator, getPayment).put(authorizedBy("محاسب", "محامي", "مدير"), updatePaymentValidator, updatePayment).delete(authorizedBy("مدير"), deletePaymentValidator, deletePayment);

module.exports = router;