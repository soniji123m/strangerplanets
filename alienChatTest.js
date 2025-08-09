import OpenAI from 'openai';
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Change to your site URL if needed
    "X-Title": "ProceduralPlanet", // Change to your site name if needed
  },
});
async function main() {
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.2-3b-instruct",
    messages: [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
  });

  console.log(completion.choices[0].message);
}

main();
