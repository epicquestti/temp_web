import { z } from "zod";

export const clientRulesSchema = z.object({
  name: z.string().min(1),
  method: z.number(),
  // reach: z.number(),
  // numberOfCondominiums: z.string().transform((value) => {
  //   return parseInt(value);
  // }),
  numberOfMontlyPayment: z.string().transform((value) => {
    return parseInt(value);
  }),
  ruleValue: z.string().transform((value) => {
    const parse = value.replaceAll(".", "").replace(",", ".");
    return Number(parseFloat(parse).toFixed(2));
  }),
});

export type clientRulesForm = z.infer<typeof clientRulesSchema>;
