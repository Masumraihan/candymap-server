import { Schema } from "mongoose";

export type TLocation = {
  userId: Schema.Types.ObjectId;
  latitude?: string;
  longitude?: string;
  address: string;
  state?: string;
  locationUrl?: string;
};
