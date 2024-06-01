import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

export const PrereqFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter your full name" }),
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email("Please enter a valid email"),
  institution: z
    .string()
    .min(1, { message: "Please enter your institution/university name" }),
  impairment: z.boolean().refine((val) => val === true, {
    message: "Please check the box to proceed",
  }),
  language: z.boolean().refine((val) => val === true, {
    message: "Please check the box to proceed",
  }),
  headset: z.boolean().optional(),
  participate: z.boolean().refine((val) => val === true, {
    message: "Please check the box to proceed",
  }),
});

export const AudioFormSchema = z.object({
  audioRatings: z.array(
    z.object({
      audioId: z.number(),
      naturalness: z.coerce
        .number({ invalid_type_error: "Please fill the score" })
        .min(1)
        .max(5),
      quality: z.coerce
        .number({ invalid_type_error: "Please fill the score" })
        .min(1)
        .max(5),
    })
  ),
});
