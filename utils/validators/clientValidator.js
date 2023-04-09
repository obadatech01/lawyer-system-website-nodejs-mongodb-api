const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Client = require("../../models/clientModel");

exports.createClientValidator = [
  check("name")
    .notEmpty()
    .withMessage("يرجى إدخال اسم العميل"),

  body("identificationNumber")
    .notEmpty()
    .withMessage("يرجى إدخال رقم هوية العميل"),

  body("nationality")
    .notEmpty()
    .withMessage("يرجى إدخال جنسية العميل"),

  body("gender")
    .notEmpty()
    .withMessage("يرجى إدخال جنس العميل"),

  body("phone")
    .notEmpty()
    .withMessage("يرجى إدخال رقم جوال العميل"),

  body("address")
    .notEmpty()
    .withMessage("يرجى إدخال عنوان العميل"),

  validatorMiddleware,
];

exports.getClientValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف العميل غير صالح!")
  .custom((val) =>
    Client.findById({ _id: val }).then((data) => {
      if (!data) {
        return Promise.reject(new Error("لا يوجد عميل لهذا المعرف"));
      }
    })
    ),
  validatorMiddleware,
];

exports.updateClientValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف العميل غير صالح!")
  .custom((val) =>
    Client.findById({ _id: val }).then((data) => {
      if (!data) {
        return Promise.reject(new Error("لا يوجد عميل لهذا المعرف"));
      }
    })
    ),

  validatorMiddleware,
];

exports.deleteClientValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف العميل غير صالح!"),
  
  validatorMiddleware,
];
