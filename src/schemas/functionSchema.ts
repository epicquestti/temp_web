import { z } from "zod";

export const functionSchema = z.object({
  name: z
    .string()
    .min(3, "Nome da função deve ter ao menos 3 caracteres")
    .max(100, "Nome da função deve conter ao máximo 100 caracteres"),
  codeName: z
    .string()
    .min(3, "Identificação da função deve ter ao menos 3 caracteres")
    .max(100, "Identificação da função deve conter ao máximo 100 caracteres"),
  icon: z
    .string()
    .min(3, "icone da função deve ter ao menos 3 caracteres")
    .max(100, "icone da função deve conter ao máximo 100 caracteres"),
  active: z.boolean(),
  url: z
    .string()
    .min(3, "url da função deve ter ao menos 3 caracteres")
    .max(300, "url da função deve conter ao máximo 100 caracteres"),
  deviceComponent: z.object({
    id: z.number(),
    name: z.string(),
  }),
  visible: z.boolean(),
  functionActions: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

export type functionForm = z.infer<typeof functionSchema>;
