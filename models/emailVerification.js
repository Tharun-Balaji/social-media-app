import mongoose from "mongoose";

const emailVerificationSchema = mongoose.Schema({
  userId: String,
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const Verification = mongoose.model("Verification", emailVerificationSchema);

export default Verification;