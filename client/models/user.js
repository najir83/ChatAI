import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  clerk_id: {
    type: String,
    required: true,
  },
  collectionLimit: {
    type: Number,
    default: 5,
  },
  createdCollection: {
    type: Number,
    default: 0,
  },
    role: {
    type: String,
    enum: ["user", "admin","subscribedUser"], // Add roles as needed
    default: "user",
  },
});

// Prevent model overwrite issue in dev
export default mongoose.models.User || mongoose.model("User", userSchema);
