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

export const userValidations = {
  createParentValidationSchema,
};

export default createParentValidationSchema;
