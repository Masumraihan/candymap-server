import { z } from "zod";

const createContentValidationSchema = z.object({
  body: z.object({
    type: z.string({ required_error: "Type is required" }),
    content: z.string({ required_error: "Content is required" }),
  }),
});

export const ContentValidations = { createContentValidationSchema };
