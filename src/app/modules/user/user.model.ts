import { Schema, model } from "mongoose";
import { TUser, UserStaticModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

export const UserSchema = new Schema<TUser, UserStaticModel>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "parent", "candyGiver"],
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function (next) {
  const user = this;

  // hashing password
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
  next();
});

// SAVE "" AFTER SAVING PASSWORD
UserSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hastPassword: string,
) {
  console.log({ plainTextPassword, hastPassword });
  return await bcrypt.compare(plainTextPassword, hastPassword);
};

const UserModel = model<TUser, UserStaticModel>("User", UserSchema);

export default UserModel;
