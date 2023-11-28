import { z } from "zod";

export const clientRulesSchema = z.object({
  name: z.string().min(1),
});

export type clientRulesForm = z.infer<typeof clientRulesSchema>;
