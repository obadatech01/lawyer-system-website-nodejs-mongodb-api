const express = require('express');
const { authorizedBy, auth } = require('../controllers/authController');
const { getUsers, createUser, getUser, updateUser, deleteUser, changeUserPassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData } = require('../controllers/userController');
const { getUserValidator, updateUserValidator, deleteUserValidator, createUserValidator, changeUserPasswordValidator, updateLoggedUserValidator } = require('../utils/validators/userValidator');
const upload = require('./S3');
const router = express.Router();

router.use(auth);

router.get('/getMe',getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/changeMe', upload.single('profileImg'), updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);

router.put('/changePassword/:id', authorizedBy("مدير"), changeUserPasswordValidator, changeUserPassword);
router.route('/')
  .get(authorizedBy("سكرتير","مدير"), getUsers)
  .post(authorizedBy("مدير"), upload.single('profileImg'), createUserValidator, createUser);

router.route('/:id')
  // .get(authorizedBy("سكرتير","مدير"), getUserValidator, getUser)
  .get(getUserValidator, getUser)
  .put(authorizedBy("مدير"), upload.single('profileImg'), updateUserValidator, updateUser)
  .delete(authorizedBy("مدير"), deleteUserValidator, deleteUser);

module.exports = router;

