import { Schema } from "mongoose";

export type TContent = {
  creator: Schema.Types.ObjectId;
  content: string;
  type: string;
};
