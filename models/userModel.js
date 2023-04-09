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
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Username is required"],
    },
    identificationNumber: {
      type: Number,
      trim: true,
      required: [true, "User identification number is required"]
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'User phone required!']
    },
    image: {
      type: String,
      default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    whatsapp: {
      type: String,
      required: [true, 'User whatsapp required!']
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: [true, "User role is required"]
    },
    address: {
      type: String,
      required: [true, "User address is required"]
    },
    permissions: {
      type: mongoose.Schema.ObjectId,
      ref: 'Permission',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "User ID is required"],
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }
  },{ timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


// Mongoose query middleware
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'permissions'
  });
  
  this.populate({
    path: 'createdBy',
    select: 'name'
  });

  this.populate({
    path: 'updatedBy',
    select: 'name'
  });
  
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;