import crypto from "crypto";

export const generateResetToken = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  return token;
};

