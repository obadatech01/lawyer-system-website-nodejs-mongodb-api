const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Client name is required"],
      minlength: [3, "Too short client name"],
    },
    companyName: String,
    identificationNumber: {
      type: Number,
      unique: [true, "Client identification number is unique"],
      trim: true,
      required: [true, "Client identification number is required"]
    },
    email: String,
    nationality: {
      type: String,
      required: [true, 'Client nationality required!']
    },
    gender: {
      type: String,
      required: [true, 'Client gender required!'],
      enum: ['male', 'female'],
      default: 'male'
    },
    phone: {
      type: String,
      required: [true, 'Client phone required!']
    },
    address: {
      type: String,
      required: [true, "Client address is required"]
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
clientSchema.pre(/^find/, function (next) {
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

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;