import { z } from "zod";

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1)
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  cel: z.string(),
  email: z.string(),
  phone: z.string(),
  cep: z.string(),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  city: z.object({
    id: z.number(),
    name: z.string(),
  }),
  state: z.object({
    id: z.number(),
    name: z.string(),
  }),
  obs: z.string(),
});

export type userProfileForm = z.infer<typeof userProfileSchema>;
