const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Permission = require("../../models/permissionsModel");
const User = require("../../models/userModel");

exports.createPermissionValidator = [
  check("name")
    .notEmpty()
    .withMessage("يرجى إدخال اسم الصلاحية"),

  body("permissions")
    .notEmpty()
    .withMessage("يرجى إدخال صلاحيات لهذا الحقل"),
  
  validatorMiddleware,
];

exports.getPermissionValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف الصلاحيات غير صالح!")
  .custom((val) =>
    Permission.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا توجد صلاحية لهذا المعرف"));
        }
      })
      ),
  validatorMiddleware,
];

exports.updatePermissionValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف الصلاحيات غير صالح!")
  .custom((val) =>
      Permission.findById({ _id: val }).then((data) => {
        if (!data) {
          return Promise.reject(new Error("لا توجد صلاحية لهذا المعرف"));
        }
      })
      ),

  validatorMiddleware,
];

exports.deletePermissionValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف الصلاحيات غير صالح!"),
  
  validatorMiddleware,
];
