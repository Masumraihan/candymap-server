import { Schema, model } from "mongoose";
import { TContent } from "./content.interface";

export const ContentSchema = new Schema<TContent>(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const ContentModel = model<TContent>("Content", ContentSchema);

export default ContentModel;
