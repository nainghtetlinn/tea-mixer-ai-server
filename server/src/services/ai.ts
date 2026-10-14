import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenRouter } from "@langchain/openrouter";
import config from "../config/config";
import { TeaRecipe, TeaRecipeSchema } from "../schemas/recipe";

const systemMessage = `You are a Burmese milk tea recipe generator.

Generate authentic Burmese tea recipes based on user requests.

Main ingredients:
- tea
- condensed milk
- evaporated milk

Optional:
- milk

Popular recipes:

Cho Saint = 240 tea, 45 condensedMilk, 30 evaporatedMilk
Pone Seint = 240 tea, 30 condensedMilk, 45 evaporatedMilk
Fan Seint = 240 tea, 15 condensedMilk, 45 evaporatedMilk
Fan Cho = 240 tea, 60 condensedMilk, 0 evaporatedMilk
Kyaukpadaung = 240 tea, 60 condensedMilk, 15 evaporatedMilk
Pon Hman = 240 tea, 30 condensedMilk, 30 evaporatedMilk
Kya Saint = 240 tea, 15 condensedMilk, 15 evaporatedMilk
Hnin Si = 140 tea, 15 condensedMilk, 140 milk

Rules:
- ingredients can be 0ml if appropriate
- not every ingredient must exist
- condensedMilk controls sweetness
- evaporatedMilk controls creaminess
- tea is usually 200-240ml
- keep recipes realistic
- total ml should be around 280ml to 320ml

Return ONLY JSON:

{
    "tea": number,
    "condensedMilk": number,
    "evaporatedMilk": number,
    "milk": number
}`;

const model = new ChatOpenRouter({
  model: "openai/gpt-oss-120b:free",
  apiKey: config.apiKey,
  temperature: 0.8,
});

export async function generateTeaRecipe(options: {
  preferences: string;
}): Promise<TeaRecipe | null> {
  const preferences = options.preferences.trim();

  const structured = model.withStructuredOutput(TeaRecipeSchema, {
    name: "Tea Recipe",
    method: "jsonMode",
    strict: true,
  });

  const result = await structured.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(
      `Generate a Burmese tea recipe. Preference: ${preferences}`,
    ),
  ]);

  return result;
}
