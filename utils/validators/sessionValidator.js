const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Case = require("../../models/caseModel");
const Session = require("../../models/sessionModel");

exports.createSessionValidator = [
  check("title")
    .notEmpty()
    .withMessage("يرجى إدخال عنوان الجلسة"),

  body("lawyerName")
    .notEmpty()
    .withMessage("يرجى إدخال اسم محامي الجلسة"),
  
  body("sessionDate")
    .notEmpty()
    .withMessage("يرجى إدخال تاريخ الجلسة"),
  
  check("case").isMongoId().withMessage("تنسيق معرف القضية غير صالح!")
    .custom((val) =>
      Case.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا توجد قضية لهذا المعرف"));
        }
      })
      ),

  validatorMiddleware,
];

exports.getSessionValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف الجلسة غير صالح!")
  .custom((val) =>
    Session.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا توجد جلسة لهذا المعرف"));
        }
      })
      ),
  validatorMiddleware,
];

exports.updateSessionValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف الجلسة غير صالح!")
  .custom((val) =>
      Session.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا توجد جلسة لهذا المعرف"));
        }
      })
      ),

  validatorMiddleware,
];

exports.deleteSessionValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف الجلسة غير صالح!"),
  
  validatorMiddleware,
];
