const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Document name is required"]
    },
    document: {
      type: String,
      required: [true, "Document image is required"]
    },
    case: {
      type: mongoose.Schema.ObjectId,
      ref: 'Case',
      required: [true, "Case ID is required"],
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

// Mongoose query middleware
documentSchema.pre(/^find/, function (next) {
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

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;