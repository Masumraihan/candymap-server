import { Schema } from "mongoose";

export type TLocation = {
  user: Schema.Types.ObjectId;
  latitude?: string;
  longitude?: string;
  address: string;
  state?: string;
  locationUrl?: string;
};
