const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: [3, "Too short user name"],
    },
    identificationNumber: {
      type: Number,
      trim: true,
      required: [true, "User identification number is required"],
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      lowercase: true,
    },
    profileImg: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    phone: {
      type: String,
      required: [true, "User phone required!"],
    },
    whatsapp: {
      type: String,
      required: [true, "User whatsapp required!"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, "Too short password"],
    },
    gender: {
      type: String,
      enum: ["ذكر", "أنثى"],
      default: "ذكر",
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["محاسب", "سكرتير", "محامي", "نائب المدير", "مدير"],
      default: "محامي",
      required: [true, "User role is required"],
    },
    address: {
      type: String,
      required: [true, "User address is required"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    return next(error);
  }
});

// Mongoose query middleware
userSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "createdBy", select: "name" },
    { path: "updatedBy", select: "name" },
  ]);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
