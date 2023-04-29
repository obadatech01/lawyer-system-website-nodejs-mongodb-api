const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Case = require("../../models/caseModel");
const Client = require("../../models/clientModel");

exports.createCaseValidator = [
  check("title")
    .notEmpty()
    .withMessage("يرجى إدخال عنوان القضية"),

  body("type")
    .notEmpty()
    .withMessage("يرجى إدخال نوع القضية"),

  body("courtCaseNumber")
    .notEmpty()
    .withMessage("يرجى إدخال رقم القضية في المحكمة"),

  body("courtName")
    .notEmpty()
    .withMessage("يرجى إدخال اسم المحكمة"),

  body("judgeName")
    .notEmpty()
    .withMessage("يرجى إدخال اسم القاضي"),

  body("clientType")
    .notEmpty()
    .withMessage("يرجى إدخال نوع العميل"),

  body("cost")
    .notEmpty()
    .withMessage("يرجى إدخال تكلفة القضية"),

  body("opponentType")
    .notEmpty()
    .withMessage("يرجى إدخال نوع الخصم"),

  body("opponentLawyerName")
    .notEmpty()
    .withMessage("يرجى إدخال اسم محامي الخصم"),

  // body("opponentLawyerPhone")
  //   .notEmpty()
  //   .withMessage("يرجى إدخال رقم جوال محامي الخصم"),
  
  body("opponentName")
    .notEmpty()
    .withMessage("يرجى إدخال اسم الخصم"),
  
  body("opponentIdentificationNumber")
    .notEmpty()
    .withMessage("يرجى إدخال رقم هوية الخصم"),
  
  body("opponentPhone")
    .notEmpty()
    .withMessage("يرجى إدخال رقم جوال الخصم"),
  
  body("opponentAddress")
    .notEmpty()
    .withMessage("يرجى إدخال عنوان الخصم"),

  check("client")
    .notEmpty()
    .withMessage("يرجى إدخال بيانات العميل")
    .isMongoId().withMessage('تنسيق معرف العميل غير صالح!')
    .custom((val) =>
      Client.findById({ _id: val }).then((client) => {
        if (!client) {
          return Promise.reject(new Error("لا يوجد عميل بهذا المعرف"));
        }
      })
    ),  

  validatorMiddleware,
];

exports.getCaseValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف القضية غير صالح!")
  .custom((val) =>
    Case.findById({ _id: val }).then((data) => {
      if (!data) {
        return Promise.reject(new Error("لا توجد قضية لهذا المعرف"));
      }
    })
    ),
  validatorMiddleware,
];

exports.updateCaseValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف القضية غير صالح!")
  .custom((val) =>
    Case.findById({ _id: val }).then((data) => {
      if (!data) {
        return Promise.reject(new Error("لا توجد قضية لهذا المعرف"));
      }
    })
    ),
  body("title").optional(),

  validatorMiddleware,
];

exports.deleteCaseValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف القضية غير صالح!"),
  
  validatorMiddleware,
];
