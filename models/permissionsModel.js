const mongoose = require("mongoose");

const permissionsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    permissions: {
      type: [String],
      required: [true, "Permissions is required"],
      enum: [
        // User Permission
        "users-permission",

        // Client Permission
        "clients-permission",

        // Case Permission
        "cases-permission",

        // Session Permission
        "sessions-permission",

        // Document Permission
        "documents-permission",

        // Expense Permission
        "expenses-permission",

        // Payment Permission
        "payments-permission",         

        // Role Permission
        "roles-permission",         
      ]
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
permissionsSchema.pre(/^find/, function (next) {
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

const Permission = mongoose.model("Permission", permissionsSchema);

module.exports = Permission;