import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";

const generateAvatarUrl = (email) => {
  const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: function () {
        return generateAvatarUrl(this.email);
      },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
