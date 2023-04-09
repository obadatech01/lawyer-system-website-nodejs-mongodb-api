const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Case title is required"],
    },
    type: {
      type: String,
      trim: true,
      required: [true, "Case type is required"],
      enum: []
    },
    courtCaseNumber: {
      type: String,
      trim: true,
      required: [true, "Court case number is required"],
    },
    courtName: {
      type: String,
      trim: true,
      required: [true, "Court case name is required"],
      enum: []
    },
    judgeName: {
      type: String,
      trim: true,
      required: [true, "Judge case Name is required"],
    },
    client: [{ 
      type: mongoose.Schema.ObjectId, 
      ref: "Client",
      required: [true, "Client ID is required"]
    }],
    clientType: {
      type: String,
      trim: true,
      required: [true, "Client type is required"],
      enum: ['plaintiff', 'respondent']
    },
    cost: {
      type: Number,
      required: [true, "Case cost is required"],
    },
    opponent: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        name: String,
        companyName: String,
        identificationNumber: String,
        nationality: String,
        email: String,
        phone: String,
        address: String,
      }
    ],
    opponentType: {
      type: String,
      required: [true, "Opponent type is required"],
      enum: ['plaintiff', 'respondent']
    },
    opponentLawyerName: {
      type: String,
      required: [true, "Opponent lawyer name is required"],
    },
    opponentLawyerPhone: {
      type: String,
      required: [true, "Opponent lawyer phone is required"],
    },
    status: {
      type: Boolean,
      default: false,
      // true: case is completed, false: case is not completed
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
caseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'client',
    select: 'name'
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

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;