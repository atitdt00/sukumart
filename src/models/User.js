import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Clerk user ID
    // Required for Clerk customers, but not necessarily for custom admins
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Only used for custom admin authentication
    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;