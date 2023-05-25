const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

const User = require("../models/userModel");
const createToken = require("../utils/createToken");

// @desc Signup
// @route POST /api/v1/auth/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const {
    name,
    email,
    password,
    identificationNumber,
    phone,
    whatsapp,
    address,
  } = req.body;

  let profileImg = "";
  if (req.file.location) {
    profileImg = req.file.location;
  }

  const user = await User.create({
    name,
    email,
    password,
    identificationNumber,
    phone,
    whatsapp,
    address,
    profileImg: profileImg,
  });

  // 2- Generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validator)
  // 2) check if user exists & password is correct
  const user = await User.findOne({ email: req.body.email });
  // console.log(user);
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password!", 401));
  }
  // 3) generate token
  const token = createToken(user._id);

  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc make sure the user is logged in
exports.auth = asyncHandler(async (req, res, next) => {
  // 1) check if token exists. if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) verify token (no change happen, expire token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // console.log(decoded);

  // 3) check if user exists.
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist...",
        401
      )
    );
  }

  // 4) check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. Please login again...",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc Authorization (User role)
exports.authorizedBy = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)

    if (!roles.includes(req.user.role)) {
      return next(new ApiError('غير مسموح لك بالوصول إلى هذا المسار', 403));
    }
    return next();
  });

const hashedCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

// @desc Forgot Password
// @route POST /api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
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
  const htmlMailMessage = `<div
  style="
    border-style: solid;
    border-width: thin;
    border-color: #dadce0;
    border-radius: 8px;
    padding: 40px 20px;
  "
  align="center"
  class="m_4092789471219683255mdv2rw"
>
  <img
    src="https://lawyer-app-graduated.s3.amazonaws.com/logo%23582741.png"
    width="90"
    height="90"
    aria-hidden="true"
    style="margin-bottom: 16px"
  />
  <div
    style="
      font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial,
        sans-serif;
      border-bottom: thin solid #dadce0;
      color: rgba(0, 0, 0, 0.87);
      line-height: 32px;
      padding-bottom: 24px;
      text-align: center;
      word-break: break-word;
    "
  >
    <div style="font-size: 24px">
      تمّ إنشاء كود التفعيل لتسجّل الدخول إلى حسابكَ
    </div>
    <table align="center" style="margin-top: 8px">
      <tbody>
        <tr style="line-height: normal">

          <td>
            <a
              style="
                font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica,
                  Arial, sans-serif;
                color: rgba(0, 0, 0, 0.87);
                font-size: 14px;
                line-height: 20px;
              "
              ><span dir="ltr"><b>< ${user.email} ></b> <strong>:برنامج المحامي</strong></span>&rlm;</a
            >
          </td>
          <td align="right" style="padding-right: 8px">
            <img
              width="20"
              height="20"
              style="
                width: 20px;
                height: 20px;
                vertical-align: sub;
                border-radius: 50%;
              "
              src="${user.profileImg}"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    style="
      font-family: Roboto-Regular, Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.87);
      line-height: 20px;
      padding-top: 20px;
      text-align: right;
    "
  >
  مرحبًا <strong>${user.name}</strong> ، لقد تلقينا طلبًا لإعادة تعيين كلمة المرور على حساب المحامي الخاص بك. تم إنشاء رمز تفعيل صالح لمدة <strong>10 دقائق</strong> حتى تتمكن من تسجيل الدخول إلى حسابك، أدخل هذا الرمز <strong>${resetCode}</strong> لإكمال إعادة التعيين. شكرًا لمساعدتنا في الحفاظ على أمان حسابك. <strong>الدعم الفني</strong>
    <div style="padding-top: 32px; text-align: center">
      <b
        href="https://accounts.google.com/AccountChooser?Email=progobadaabumusameh@gmail.com&amp;continue=https://myaccount.google.com/alert/nt/1681934774141?rfn%3D20%26rfnc%3D1%26eid%3D-2350533448855659899%26et%3D1"
        style="
          font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial,
            sans-serif;
          line-height: 16px;
          color: #ffffff;
          font-weight: 400;
          text-decoration: none;
          font-size: 14px;
          display: inline-block;
          padding: 10px 24px;
          background-color: #4184f3;
          border-radius: 5px;
          min-width: 90px;
        "
        >كود التفعيل: ${resetCode}</b>
    </div>
  </div>
  <span class="im"
    ><div
      style="
        padding-top: 20px;
        font-size: 12px;
        line-height: 16px;
        color: #5f6368;
        letter-spacing: 0.3px;
        text-align: center;
      "
    >
      يمكنك أيضا التواصل مع الدعم الفني عبر البريد اللإلكتروني التالي:
    <br /><a href="mailto: progobadaabumusameh@gmail.com"
        style="color: rgba(0, 0, 0, 0.87); text-decoration: inherit"
        >-progobadaabumusameh@gmail.com- :بريد الدعم الفني</a
      >.
    </div></span>
</div>`;
  try {
    await sendEmail({
      email: user.email,
      subject: "رمز إعادة تعيين كلمة المرور الخاصة بك (صالح لمدة 10 دقائق)",
      html: htmlMailMessage,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

// @desc Verify Password Reset Code
// @route POST /api/v1/auth/verifyResetCode
// @access Public
exports.verifyResetPasswordCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = hashedCode(req.body.resetCode);

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired", 404));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

// @desc Reset Password
// @route PUT /api/v1/auth/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
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
