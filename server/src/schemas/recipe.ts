import { z } from "zod";

export const TeaRecipeSchema = z.object({
  tea: z.number().int().min(0),
  condensedMilk: z.number().int().min(0),
  evaporatedMilk: z.number().int().min(0),
  milk: z.number().int().min(0),
});

export type TeaRecipe = z.infer<typeof TeaRecipeSchema>;
