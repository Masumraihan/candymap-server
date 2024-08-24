import { z } from "zod";

const userValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" }),

  password: z
    .string({
      invalid_type_error: "Password must be string",
    })
    .min(6, { message: "Password can not be less then 6 characters" })
    .max(20, { message: "Password can not be more then 20 characters" }),
  role: z.enum(["admin", "parent", "candyGiver"], {
    invalid_type_error: "Role must be admin, parent or candyGiver",
    required_error: "Role is required",
  }),
  creator: z.string({ invalid_type_error: "Creator must be string" }).optional(),
});

export const userValidations = {
  userValidationSchema,
};

export default userValidationSchema;
