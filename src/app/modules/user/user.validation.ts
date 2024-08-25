import { z } from "zod";

const createParentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Invalid email address" }),
    creator: z.string({
      invalid_type_error: "Creator must be string",
      required_error: "Creator Id is required",
    }),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z
    .object({
      name: z.string(),
      email: z.string().email({ message: "Invalid email address" }),
      address: z.string(),
      latitude: z.string(),
      longitude: z.string(),
      locationUrl: z.string(),
    })
    .partial(),
});

export const userValidations = {
  createParentValidationSchema,
  updateProfileValidationSchema,
};

export default createParentValidationSchema;
