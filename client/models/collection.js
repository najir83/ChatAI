import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  clerk_id: {
    type: String,
    required: true,
  },
  query_limit: {
    type: Number,
    default: 15,
  },
  used_query: {
    type: Number,
    default: 0,
  },
  query_reset_time: {
    type: Date,
    default: Date.now,
  },
});

collectionSchema.statics.resetQueryIfNeeded = async function (collectionId) {
  const collection = await this.findById(collectionId);
  if (!collection) return null;

  const now = new Date();
  const diffInDays =
    (now - collection.query_reset_time) / (1000 * 60 * 60 * 24);

  if (diffInDays >= 7) {
    collection.used_query = 0;
    collection.query_reset_time = now;
    await collection.save();
  }

  return collection;
};

// Prevent model overwrite issue in dev
export default mongoose.models.Collection ||
  mongoose.model("Collection", collectionSchema);
