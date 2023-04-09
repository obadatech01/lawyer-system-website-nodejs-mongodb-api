const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("يرجى إدخال اسم المستحدم")
    .isLength({ min: 3 })
    .withMessage("اسم المستخدم قصير جدا"),

  body("username")
    .notEmpty()
    .withMessage("اسم المستخدم مطلوب")
    .custom((val) =>
    User.findOne({ username: val }).then((user) => {
      if (user) {
        return Promise.reject(new Error("اسم المستخدم مكرر"));
      }
    })
  ),

  check("email")
    .notEmpty()
    .withMessage("يرجى إدخال البريد الإلكتروني")
    .isEmail()
    .withMessage("يرجى إدخال البريد الإلكتروني بشكل صحيح")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("هذا البريد الإلكتروني موجود مسبقًا"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("يرجى إدخال كلمة السر")
    .isLength({ min: 6 })
    .withMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل!')
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error('مطلوب تأكيد كلمة مرور المستخدم!');
      }
      return true;
    }),

  check("confirmPassword")
    .notEmpty()
    .withMessage('مطلوب تأكيد كلمة مرور المستخدم!')
    .isLength({ min: 6 })
    .withMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل!'),

  check("phone")
    .notEmpty()
    .withMessage("يرجى إدخال رقم الجوال"),

  check("whatsapp")
    .notEmpty()
    .withMessage("يرجى إدخال رقم الواتس بمقدمة الواتس الخاصة بحسابك"),
  
  check("address")
    .notEmpty()
    .withMessage("يرجى إدخال عنوان المستخدم"),

  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف المستخدم غير صالح!")
  .custom((val) =>
    User.findById({ _id: val }).then((data) => {
      if (!data) {
        return Promise.reject(new Error("لا يوجد مستخدم لهذا المعرف"));
      }
    })
    ),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف المستخدم غير صالح!")
  .custom((val) =>
      User.findById({ _id: val }).then((user) => {
        if (!user) {
          return Promise.reject(new Error("لا يوجد مستخدم لهذا المعرف"));
        }
      })
    ),
  body("name").optional(),
  body("username").optional().custom((val) =>
    User.findOne({ username: val }).then((user) => {
      if (user) {
        return Promise.reject(new Error("اسم المستخدم موجود مسبقًا"));
      }
    })
  ),

  check("email")
    .optional()
    // .notEmpty()
    // .withMessage("User email is required!")
    .isEmail()
    .withMessage("Invalid email address!")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("هذا البريد الإلكتروني مستخدم مسبقًا"));
        }
      })
    ),

  check("phone").optional(),
  check("whatsapp").optional(),
  check("address").optional(),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف المستخدم غير صالح!"),
  body("currentPassword")
    .notEmpty()
    .withMessage("يجب عليك إدخال كلمة مرورك الحالية!"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("يجب عليك إدخال تأكيد كلمة المرور!"),
  body("password")
    .notEmpty()
    .withMessage("يجب عليك إدخال كلمة المرور الجديدة الخاصة بك!")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("لا يوجد مستخدم لهذا المعرف");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("كلمة المرور الحالية غير صحيحة!");
      }

      // 2) Verify password confirm
      if (val !== req.body.confirmPassword) {
        throw new Error("تأكيد كلمة المرور غير صحيح!");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("تنسيق معرف المستخدم غير صالح!"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("name").optional(),
  body("username").optional().custom((val) =>
    User.findOne({ username: val }).then((user) => {
      if (user) {
        return Promise.reject(new Error("اسم المستخدم موجود مسبقًا"));
      }
    })
  ),
  body("email")
    .optional()
    // .notEmpty()
    // .withMessage("User email is required!")
    .isEmail()
    .withMessage("Invalid email address!")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("هذا البريد الإلكتروني مستخدم مسبقًا"));
        }
      })
    ),

  check("phone").optional(),
  check("whatsapp").optional(),
  check("address").optional(),
    
  validatorMiddleware,
];
