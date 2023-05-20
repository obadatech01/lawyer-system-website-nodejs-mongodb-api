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

router.put('/changePassword/:id',changeUserPasswordValidator, changeUserPassword);

router.use(authorizedBy("مدير"));
router.route('/')
  .get(getUsers)
  .post(createUserValidator, upload.single('profileImg'), createUser);

router.route('/:id')
  .get(getUserValidator, getUser)
  .put(updateUserValidator, upload.single('profileImg'), updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;

