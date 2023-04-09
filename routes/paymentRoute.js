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

router.use(auth);

router.route('/').get(allowedPermissions('payments-all'), getPayments).post(allowedPermissions('payments-create'), createPaymentValidator, createPayment);
router.route('/:id').get(allowedPermissions('payments-id'), getPaymentValidator, getPayment).put(allowedPermissions('payments-update'), updatePaymentValidator, updatePayment).delete(allowedPermissions('payments-delete'), deletePaymentValidator, deletePayment);

module.exports = router;