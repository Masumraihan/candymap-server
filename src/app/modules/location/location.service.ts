import { TLocation } from "./location.interface";

const createLocationIntoDb = async (payload: TLocation) => {
  console.log(payload);
};

const getLocationFromDb = async () => {
  console.log("get called");
};

export const LocationServices = {
  createLocationIntoDb,
  getLocationFromDb,
};
