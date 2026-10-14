import { Request, Response } from "express";
import { generateTeaRecipe } from "../services/ai";

export async function chatHandler(req: Request, res: Response) {
  const recipe = await generateTeaRecipe(req.body);

  if (!recipe) throw new Error("Something went wrong");

  return res.status(201).json({ recipe });
}
