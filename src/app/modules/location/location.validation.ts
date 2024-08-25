import { z } from "zod";

const createLocationValidationSchema = z.object({
  body: z.object({
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    address: z.string({
      required_error: "Address is required",
    }),
    state: z.string().optional(),
    locationUrl: z.string().optional(),
  }),
});

export const LocationValidations = { createLocationValidationSchema };
