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
        "users-all",
        "users-id",
        "users-create",
        "users-update",
        "users-id-change-password",
        "users-delete",
        "users-profile",
        "users-updated-logged-user-password",
        "users-updated-logged-user-profile",
        "users-delete-logged-user",

        // Client Permission
        "clients-all",
        "clients-id",
        "clients-create",
        "clients-update",
        "clients-delete",

        // Case Permission
        "cases-all",
        "cases-id",
        "cases-create",
        "cases-update",
        "cases-delete",

        // Session Permission
        "sessions-all",
        "sessions-id",
        "sessions-create",
        "sessions-update",
        "sessions-delete",

        // Document Permission
        "documents-all",
        "documents-id",
        "documents-create",
        "documents-update",
        "documents-delete",

        // Expense Permission
        "expenses-all",
        "expenses-id",
        "expenses-create",
        "expenses-update",
        "expenses-delete",

        // Payment Permission
        "payments-all",
        "payments-id",
        "payments-create",
        "payments-update",
        "payments-delete",

        // Role Permission
        "permissions-all",
        "permissions-id",
        "permissions-create",
        "permissions-update",
        "permissions-delete",          
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