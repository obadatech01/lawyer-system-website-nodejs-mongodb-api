const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Expense = require("../../models/expenseModel");
const User = require("../../models/userModel");

exports.createExpenseValidator = [
  check("title")
    .notEmpty()
    .withMessage("يرجى إدخال عنوان سند الصرف"),

  body("amount")
    .notEmpty()
    .withMessage("يرجى إدخال قيمة سند الصرف"),
  
  body("exchangeDate")
    .notEmpty()
    .withMessage("يرجى إدخال تاريخ سند الصرف"),
  
  body("exchangeMethod")
    .notEmpty()
    .withMessage("يرجى إدخال طريقة الصرف"),
  
  body("userName")
    .notEmpty()
    .withMessage("يرجى إدخال اسم المستخدم المصروف له"),

  validatorMiddleware,
];

exports.getExpenseValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف سند الصرف غير صالح!")
  .custom((val) =>
    Expense.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا يوجد سند صرف لهذا المعرف"));
        }
      })
      ),
  validatorMiddleware,
];

exports.updateExpenseValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف سند الصرف غير صالح!")
  .custom((val) =>
      Expense.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا يوجد سند صرف لهذا المعرف"));
        }
      })
      ),

  validatorMiddleware,
];

exports.deleteExpenseValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف سند الصرف غير صالح!"),
  
  validatorMiddleware,
];
