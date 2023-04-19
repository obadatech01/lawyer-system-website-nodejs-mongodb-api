const express = require("express");
const {
  login,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
  signup,
} = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const upload = require('./S3');
const router = express.Router();

router.post('/signup', upload.single('profileImg'), signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyResetPasswordCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
