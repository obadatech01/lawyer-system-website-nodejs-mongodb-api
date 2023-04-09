const Permission = require("../models/permissionsModel");
const factory = require("./handlersFactory");

// @desc Get list of permissions
// @route GET /api/v1/permissions
// @access Private/admin
exports.getPermissions = factory.getAll(Permission, "Permission");

// @desc Get specific permission by id
// @route GET /api/v1/permissions/:id
// @access Private/admin
exports.getPermission = factory.getOne(Permission);

// @desc Create permission
// @route POST /api/v1/permissions
// @access Private/admin
exports.createPermission = factory.createOne(Permission);

// @desc Update specific permission
// @route PUT /api/v1/permissions/:id
// @access Private/admin
exports.updatePermission = factory.updateOne(Permission);

// @desc Delete specific permission
// @route DELETE /api/v1/permissions/:id
// @access Private/admin
exports.deletePermission = factory.deleteOne(Permission);
