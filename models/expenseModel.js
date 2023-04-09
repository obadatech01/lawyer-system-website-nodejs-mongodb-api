const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Expense title is required"]
    },
    amount: {
      type: Number,
      trim: true,
      required: [true, "Expense amount is required"]
    },
    exchangeDate: {
      type: Date,
      required: [true, "Expense date is required"]
    },
    exchangeMethod: {
      type: String,
      required: [true, "Expense method is required"],
      enum: ["cash"],
      default: 'cash'
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    notes: String,
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

// Mongoose query middleware
expenseSchema.pre(/^find/, function (next) {
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

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;