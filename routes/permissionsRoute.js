const express = require('express');

const {
  getPermission,
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} = require('../controllers/permissionsController');

const { auth, allowedPermissions } = require('../controllers/authController');
const { createPermissionValidator, getPermissionValidator, updatePermissionValidator, deletePermissionValidator } = require('../utils/validators/permissionsValidator');

const router = express.Router();

router.use(auth);

router.route('/').get(allowedPermissions('permissions-all'), getPermissions).post(allowedPermissions('permissions-create'), createPermissionValidator, createPermission);
router.route('/:id').get(allowedPermissions('permissions-id'), getPermissionValidator, getPermission).put(allowedPermissions('permissions-update'), updatePermissionValidator, updatePermission).delete(allowedPermissions('permissions-delete'), deletePermissionValidator, deletePermission);

module.exports = router;