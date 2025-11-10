import { model, Schema, Types } from "mongoose";

const workerSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  city: { type: String, trim: true, default: "" },
  experience: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  bio: { type: String, trim: true, default: "" },
  services: { type: [String], default: [] },
  profileCompleted: { type: Boolean, default: false },
  // optional fields for listing
  image: { type: String, default: null },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
}, { timestamps: true });

workerSchema.set('toJSON', {
  transform(doc, ret) {
    // remove __v
    delete ret.__v;
    return ret;
  }
});

const Worker = model("Worker", workerSchema);
export default Worker;
