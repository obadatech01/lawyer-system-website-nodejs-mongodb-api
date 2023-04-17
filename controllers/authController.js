const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require("express-async-handler");
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');

const User = require("../models/userModel");
const createToken = require('../utils/createToken');

// @desc Signup
// @route GET /api/v1/auth/signup
// @access Public
// exports.signup = asyncHandler(async (req, res, next) => {
//   // 1- Create user
//   const {name, username, email, password, identificationNumber, phone, whatsapp, address} = req.body;

//   const user = await User.create({
//     name, username, email, password, identificationNumber, phone, whatsapp, address  
//   });

//   // 2- Generate token 
//   const token = createToken(user._id);

//   res.status(201).json({data: user, token});
// });

// @desc Login
// @route GET /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validator)
  // 2) check if user exists & password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password!', 401))
  }
  // 3) generate token
  const token = createToken(user._id);

  // 4) send response to client side
  res.status(200).json({data: user, token});
});

// @desc make sure the user is logged in
exports.auth = asyncHandler(async (req, res, next) => {
  // 1) check if token exists. if exist get it
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError('You are not login, Please login to get access this route', 401));
  }

  // 2) verify token (no change happen, expire token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // console.log(decoded);

  // 3) check if user exists.
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError('The user that belong to this token does no longer exist...', 401));
  }

  // 4) check if user change his password after token created  
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(new ApiError('User recently changed his password. Please login again...', 401))
    }
  }

  req.user = currentUser;
  next();
});

// @desc Authorization (User Permissions || User admin)
exports.allowedPermissions = (...roles) => asyncHandler(async (req, res, next) => {
  // 1) access roles
  // 2) access registered user (req.user.permissions.permissions)
  
  if (req.user.role == 'admin') {
    return next();
  }
  // console.log(req.user.role);
  // console.log(req.user.permissions.permissions);
  // console.log(roles);
  
  if (!roles.every(e => req.user?.permissions?.permissions.includes(e))) {
    return next(new ApiError('You are not allowed to access this route', 403));
  }
  return next();
});

const hashedCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

// @desc Forgot Password
// @route POST /api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`There is no user with that email ${req.body.email}`, 404));
  }

  // 2) If user exist, Generate hash reset random 6 digits code and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = hashedCode(resetCode);
  
  // Save hashed password reset code into db.
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `
    Hi ${user.name},\nWe received a request to reset the password on your Lawyer Account.\n${resetCode}\nEnter this code to complete the reset.\nThanks for helping us keep your account secure.\nThe Lawyer Team
  `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message: message
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res.status(200).json({ status: 'Success', message: 'Reset code sent to email'});
});

// @desc Verify Password Reset Code
// @route POST /api/v1/auth/verifyResetCode
// @access Public
exports.verifyResetPasswordCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = hashedCode(req.body.resetCode);

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: {$gt: Date.now()}
  });
  if (!user) {
    return next(new ApiError('Reset code invalid or expired', 404));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({status: 'Success'});
});

// @desc Reset Password
// @route PUT /api/v1/auth/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`There is no user with email ${req.body.email}`, 404));
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});


