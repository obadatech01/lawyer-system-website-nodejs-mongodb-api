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

router.use(auth, allowedPermissions('roles-permission'));

router.route('/').get(getPermissions).post(createPermissionValidator, createPermission);
router.route('/:id').get(getPermissionValidator, getPermission).put(updatePermissionValidator, updatePermission).delete(deletePermissionValidator, deletePermission);

module.exports = router;