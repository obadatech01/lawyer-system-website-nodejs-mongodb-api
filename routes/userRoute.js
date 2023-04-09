const express = require('express');
const { allowedPermissions, auth } = require('../controllers/authController');
const { getUsers, createUser, getUser, updateUser, deleteUser, changeUserPassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData } = require('../controllers/userController');
const { getUserValidator, updateUserValidator, deleteUserValidator, createUserValidator, changeUserPasswordValidator, updateLoggedUserValidator } = require('../utils/validators/userValidator');

const router = express.Router();

router.use(auth);

router.get('/getMe',allowedPermissions('users-profile'),  getLoggedUserData, getUser);
router.put('/changeMyPassword',allowedPermissions('users-updated-logged-user-password'),  updateLoggedUserPassword);
router.put('/changeMe',allowedPermissions('users-updated-logged-user-profile'),  updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe',allowedPermissions('users-delete-logged-user'),  deleteLoggedUserData);

router.put('/changePassword/:id',allowedPermissions('users-id-change-password'),  changeUserPasswordValidator, changeUserPassword);

router.route('/')
  .get(allowedPermissions('users-all'), getUsers)
  .post(allowedPermissions('users-create'), createUserValidator, createUser);

router.route('/:id')
  .get(allowedPermissions('users-id'), getUserValidator, getUser)
  .put(allowedPermissions('users-update'), updateUserValidator, updateUser)
  .delete(allowedPermissions('users-delete'), deleteUserValidator, deleteUser);

module.exports = router;

