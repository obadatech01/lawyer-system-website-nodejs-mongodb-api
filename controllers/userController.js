const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const createToken = require("../utils/createToken");

// @desc Get list of users
// @route GET /api/v1/users
// @access Private/admin
exports.getUsers = factory.getAll(User, 'User');

// @desc Get specific user by id
// @route GET /api/v1/users/:id
// @access Private/admin
exports.getUser = factory.getOne(User, 'permissions');

// @desc Create user
// @route POST /api/v1/users
// @access Private/admin
exports.createUser = factory.createOne(User);

// @desc Update specific user 
// @route PUT /api/v1/users/:id
// @access Private/admin
// exports.updateUser = factory.updateOne(User);
exports.updateUser = asyncHandler( async(req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    identificationNumber: req.body.identificationNumber,
    phone: req.body.phone,
    whatsapp: req.body.whatsapp,
    address: req.body.address,
    permissions: req.body.permissions
  }, {new: true});
  if (!user) return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  res.status(200).json({ data: user});
});

// @desc Update specific user password 
// @route PUT /api/v1/users/changePassword/:id
// @access Private/admin
exports.changeUserPassword = asyncHandler( async(req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangedAt: Date.now()
  }, {new: true});
  if (!user) return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  res.status(200).json({ data: user});
});

// @desc Delete specific user 
// @route DELETE /api/v1/users/:id
// @access Private/admin
exports.deleteUser = factory.deleteOne(User);

// @desc Get Logged User Data
// @route GET /api/v1/users/getMe
// @access Protect/auth
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc Update Logged User Password
// @route PUT /api/v1/users/updateMyPassword
// @access Protect/auth
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangedAt: Date.now()
  }, {new: true});

  // 2) Generate Token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token});
});

// @desc Update Logged User Date (without password, role)
// @route PUT /api/v1/users/updateMe
// @access Protect/auth
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    identificationNumber: req.body.identificationNumber,
    phone: req.body.phone,
    whatsapp: req.body.whatsapp,
    address: req.body.address,
  }, {new: true});

  res.status(200).json({data: updateUser});
});

// @desc Deactivate Logged User
// @route DELETE /api/v1/users/deleteMe
// @access Protect/auth
exports.deleteLoggedUserData = asyncHandler( async(req, res, next) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json({status: 'Success'});
});