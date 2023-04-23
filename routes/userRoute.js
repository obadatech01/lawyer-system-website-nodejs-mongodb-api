const express = require('express');
const { allowedPermissions, auth } = require('../controllers/authController');
const { getUsers, createUser, getUser, updateUser, deleteUser, changeUserPassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData } = require('../controllers/userController');
const { getUserValidator, updateUserValidator, deleteUserValidator, createUserValidator, changeUserPasswordValidator, updateLoggedUserValidator } = require('../utils/validators/userValidator');

const router = express.Router();

router.use(auth);

router.get('/getMe',getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/changeMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);


router.use(allowedPermissions('users-permission'));

router.put('/changePassword/:id',changeUserPasswordValidator, changeUserPassword);

router.route('/')
  .get(getUsers)
  .post(createUserValidator, createUser);

router.route('/:id')
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;

