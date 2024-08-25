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
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z
    .object({
      name: z.string(),
      email: z.string().email({ message: "Invalid email address" }),
      location: z
        .object({
          address: z.string(),
          latitude: z.string(),
          longitude: z.string(),
          locationUrl: z.string(),
        })
        .partial(),
    })
    .partial(),
});

export const userValidations = {
  createParentValidationSchema,
  updateProfileValidationSchema,
};

export default createParentValidationSchema;
