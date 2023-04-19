const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
  body('name').notEmpty().withMessage('يرجى إدخال الاسم')
  .isLength({min: 3}).withMessage('هذا الاسم قصير جدا'),

  check('email').notEmpty().withMessage('يرجى إدخال البريد الإلكتروني')
  .isEmail().withMessage('يرجى إدخال البريد الإلكتروني بشكل صحيح')
  .custom((val) =>
    User.findOne({ email: val }).then((user) => {
      if (user) {
        return Promise.reject(new Error('هذا البريد الإلكتروني مستخدم مسبقًا'));
      }
    })
  ),

  check('password').notEmpty().withMessage('يرجى إدخال كلمة السر')
  .isLength({min: 6}).withMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل!')
  .custom((password, {req}) => {
    if (password !== req.body.confirmPassword) {
      throw new Error('تأكيد كلمة المرور غير صحيح!');
    }
    return true;
  }),

  check('confirmPassword').notEmpty().withMessage('مطلوب تأكيد كلمة مرور المستخدم!')
  .isLength({min: 6}).withMessage('يجب أن يتكون تأكيد كلمة المرور من 6 أحرف على الأقل!'),
    
  validatorMiddleware
];

exports.loginValidator = [
  check('email').notEmpty().withMessage('يرجى إدخال البريد الإلكتروني')
  .isEmail().withMessage('يرجى إدخال البريد الإلكتروني بشكل صحيح'),

  check('password').notEmpty().withMessage('يرجى إدخال كلمة السر')
  .isLength({min: 6}).withMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل!'),
  
  validatorMiddleware
];
