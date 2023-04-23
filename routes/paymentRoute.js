const express = require('express');

const {
  getPayment,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentController');

const { auth, allowedPermissions } = require('../controllers/authController');
const { createPaymentValidator, getPaymentValidator, updatePaymentValidator, deletePaymentValidator } = require('../utils/validators/paymentValidator');

const router = express.Router();

router.use(auth, allowedPermissions('payments-permission'));

router.route('/').get(getPayments).post(createPaymentValidator, createPayment);
router.route('/:id').get(getPaymentValidator, getPayment).put(updatePaymentValidator, updatePayment).delete(deletePaymentValidator, deletePayment);

module.exports = router;