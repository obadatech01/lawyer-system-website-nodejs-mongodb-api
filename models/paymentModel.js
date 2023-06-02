const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Payment title is required"]
    },
    amount: {
      type: Number,
      trim: true,
      required: [true, "Payment amount is required"]
    },
    exchangeDate: {
      type: Date,
      required: [true, "Payment date is required"]
    },
    exchangeMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["كاش", "شيك", "فيزا"],
      default: 'كاش'
    },
    case: {
      type: mongoose.Schema.ObjectId,
      ref: 'Case',
      required: [true, "Case ID is required"],
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: [true, "User ID is required"],
    // },
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
paymentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'case'
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

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;