const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Case = require("../../models/caseModel");
const Payment = require("../../models/paymentModel");
const User = require("../../models/userModel");

exports.createPaymentValidator = [
  check("title")
    .notEmpty()
    .withMessage("يرجى إدخال عنوان سند المدفوعات"),

  body("amount")
    .notEmpty()
    .withMessage("يرجى إدخال قيمة سند المدفوعات"),

  body("exchangeDate")
    .notEmpty()
    .withMessage("يرجى إدخال تاريخ سند المدفوعات"),

  body("exchangeMethod")
    .notEmpty()
    .withMessage("يرجى إدخال طريقة المدفوعات"),

  check("case").isMongoId().withMessage("تنسيق معرف القضية غير صالح!")
    .custom((val) =>
      Case.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا توجد قضية لهذا المعرف"));
        }
      })
      ),

  // check("user").isMongoId().withMessage("تنسيق معرف المستخدم غير صالح!")
  //   .custom((val) =>
  //     User.findById({ _id: val }).then((data) => {
  //       if (!data) {
  //         return Promise.reject(new Error("لا يوجد مستخدم لهذا المعرف"));
  //       }
  //     })
  //     ),

  validatorMiddleware,
];

exports.getPaymentValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف سند المدفوعات غير صالح!")
  .custom((val) =>
    Payment.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا يوجد سند دفع لهذا المعرف"));
        }
      })
      ),
  validatorMiddleware,
];

exports.updatePaymentValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف سند المدفوعات غير صالح!")
  .custom((val) =>
      Payment.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا يوجد سند دفع لهذا المعرف"));
        }
      })
      ),

  validatorMiddleware,
];

exports.deletePaymentValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف سند المدفوعات غير صالح!"),

  validatorMiddleware,
];
