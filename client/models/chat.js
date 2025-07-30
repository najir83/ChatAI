import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    col_name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite issue in dev
export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
