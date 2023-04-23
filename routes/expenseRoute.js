const express = require('express');

const {
  getExpense,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const { auth, allowedPermissions } = require('../controllers/authController');
const { createExpenseValidator, getExpenseValidator, updateExpenseValidator, deleteExpenseValidator } = require('../utils/validators/expenseValidator');

const router = express.Router();

router.use(auth, allowedPermissions('expenses-permission'));

router.route('/').get(getExpenses).post(createExpenseValidator, createExpense);
router.route('/:id').get(getExpenseValidator, getExpense).put(updateExpenseValidator, updateExpense).delete(deleteExpenseValidator, deleteExpense);

module.exports = router;