import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  baseURL: process.env.AIML_API_URL,
  apiKey: process.env.AIML_API_KEY, 
});

export async function generateQuiz(language, numQuestions = 15) {
   const prompt = `Generate a ${numQuestions}-question multiple choice quiz about ${language}.
Respond ONLY with a valid JSON array, with no extra text, no explanations, and no markdown formatting.
Format exactly like:
[
  {
    "question": "Question text",
    "choices": ["A", "B", "C", "D"],
    "correct_answer": "A"
  }
]
  `;

  const response = await client.chat.completions.create({
    model: "meta-llama/Llama-Vision-Free", 
    messages: [
      { role: "system", content: "You are a quiz generator assistant." },
      { role: "user", content: prompt }
    ],
  });

  console.log("hiir", response.choices[0].message.content);
  return response.choices[0].message.content;
}

