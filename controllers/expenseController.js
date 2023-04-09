const Expense = require("../models/expenseModel");
const factory = require("./handlersFactory");

// @desc Get list of expenses
// @route GET /api/v1/expenses
// @access Protect/auth
exports.getExpenses = factory.getAll(Expense, "Expense");

// @desc Get specific expense by id
// @route GET /api/v1/expenses/:id
// @access Protect/auth
exports.getExpense = factory.getOne(Expense);

// @desc Create expense
// @route POST /api/v1/expenses
// @access Protect/auth
exports.createExpense = factory.createOne(Expense);

// @desc Update specific expense
// @route PUT /api/v1/expenses/:id
// @access Protect/auth
exports.updateExpense = factory.updateOne(Expense);

// @desc Delete specific expense
// @route DELETE /api/v1/expenses/:id
// @access Private/admin
exports.deleteExpense = factory.deleteOne(Expense);
