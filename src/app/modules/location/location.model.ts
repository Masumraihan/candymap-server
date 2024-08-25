import { Schema, model } from "mongoose";
import { TLocation } from "./location.interface";

export const LocationSchema = new Schema<TLocation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    locationUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const LocationModel = model<TLocation>("Location", LocationSchema);

export default LocationModel;
