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
      // enum: ["بداية", "صلح"] 
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
      // enum: []
    },
    judgeName: {
      type: String,
      trim: true,
      required: [true, "Judge case Name is required"],
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "Client",
      required: [true, "Client ID is required"]
    },
    // client: [{
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Client",
    //   required: [true, "Client ID is required"]
    // }],
    clientType: {
      type: String,
      trim: true,
      required: [true, "Client type is required"],
      // enum: ["مدعي", "مدعي عليه"]
    },
    cost: {
      type: Number,
      required: [true, "Case cost is required"],
    },
    opponentName: {
      type: String,
      required: [true, "Opponent name is required"],
    },
    opponentIdentificationNumber: {
      type: String,
      required: [true, "Opponent identificationNumber is required"],
    },
    opponentPhone: {
      type: String,
      required: [true, "Opponent phone is required"],
    },
    opponentAddress: {
      type: String,
      required: [true, "Opponent address is required"],
    },
    // opponent: [
    //   {
    //     id: { type: mongoose.Schema.Types.ObjectId },
    //     name: String,
    //     companyName: String,
    //     identificationNumber: String,
    //     nationality: String,
    //     email: String,
    //     phone: String,
    //     address: String,
    //   }
    // ],
    opponentType: {
      type: String,
      required: [true, "Opponent type is required"],
      // enum: ["مدعي", "مدعي عليه"]
    },
    opponentLawyerName: {
      type: String,
      required: [true, "Opponent lawyer name is required"],
    },
    // opponentLawyerPhone: {
    //   type: String,
    //   required: [true, "Opponent lawyer phone is required"],
    // },
    status: {
      type: String,
      default: 'غير مكتملة',
      // enum: ['مكتملة', 'غير مكتملة']
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