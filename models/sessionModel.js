const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Session name is required"],
    },
    lawyerName: {
      type: "String",
      required: [true, "lawyerName is required"],
    },
    sessionDate: {
      type: Date,
      required: [true, "Session date is required"],
    },
    case: {
      type: mongoose.Schema.ObjectId,
      ref: "Case",
      required: [true, "Case ID is required"],
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
  },
  { timestamps: true }
);

// Mongoose query middleware
sessionSchema.pre(/^find/, function (next) {
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

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
