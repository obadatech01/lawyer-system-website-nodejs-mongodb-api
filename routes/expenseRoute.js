const express = require('express');

const {
  getExpense,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const { auth, authorizedBy } = require('../controllers/authController');
const { createExpenseValidator, getExpenseValidator, updateExpenseValidator, deleteExpenseValidator } = require('../utils/validators/expenseValidator');

const router = express.Router();


router.use(auth);

router.route('/').get(authorizedBy("محاسب", "نائب المدير", "مدير"), getExpenses).post(authorizedBy("محاسب", "نائب المدير", "مدير"), createExpenseValidator, createExpense);
router.route('/:id').get(authorizedBy("محاسب", "نائب المدير", "مدير"), getExpenseValidator, getExpense).put(authorizedBy("محاسب", "نائب المدير", "مدير"), updateExpenseValidator, updateExpense).delete(authorizedBy("مدير"), deleteExpenseValidator, deleteExpense);

module.exports = router;