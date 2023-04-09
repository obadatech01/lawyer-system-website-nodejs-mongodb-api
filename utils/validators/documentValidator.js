const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Case = require("../../models/caseModel");
const Document = require("../../models/documentModel");

exports.createDocumentValidator = [
  check("title")
    .notEmpty()
    .withMessage("يرجى إدخال عنوان المستند"),

  body("document")
    .notEmpty()
    .withMessage("يرجى إدخال مستندات القضية"),
  
  check("case").isMongoId().withMessage("تنسيق معرف المستند غير صالح!")
    .custom((val) =>
      Case.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا يوجد مستند لهذا المعرف"));
        }
      })
      ),

  validatorMiddleware,
];

exports.getDocumentValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف المستند غير صالح!")
  .custom((val) =>
    Document.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا يوجد مستند لهذا المعرف"));
        }
      })
      ),
  validatorMiddleware,
];

exports.updateDocumentValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف المستند غير صالح!")
  .custom((val) =>
      Document.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا يوجد مستند لهذا المعرف"));
        }
      })
      ),

  validatorMiddleware,
];

exports.deleteDocumentValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف المستند غير صالح!"),
  
  validatorMiddleware,
];
