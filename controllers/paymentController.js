const Payment = require("../models/paymentModel");
const factory = require("./handlersFactory");

// @desc Get list of payments
// @route GET /api/v1/payments
// @access Protect/auth
exports.getPayments = factory.getAll(Payment, "Payment");

// @desc Get specific payment by id
// @route GET /api/v1/payments/:id
// @access Protect/auth
exports.getPayment = factory.getOne(Payment);

// @desc Create payment
// @route POST /api/v1/payments
// @access Protect/auth
exports.createPayment = factory.createOne(Payment);

// @desc Update specific payment
// @route PUT /api/v1/payments/:id
// @access Protect/auth
exports.updatePayment = factory.updateOne(Payment);

// @desc Delete specific payment
// @route DELETE /api/v1/payments/:id
// @access Private/admin
exports.deletePayment = factory.deleteOne(Payment);
