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

router.use(auth);

router.route('/').get(allowedPermissions('expenses-all'), getExpenses).post(allowedPermissions('expenses-create'), createExpenseValidator, createExpense);
router.route('/:id').get(allowedPermissions('expenses-id'), getExpenseValidator, getExpense).put(allowedPermissions('expenses-update'), updateExpenseValidator, updateExpense).delete(allowedPermissions('expenses-delete'), deleteExpenseValidator, deleteExpense);

module.exports = router;