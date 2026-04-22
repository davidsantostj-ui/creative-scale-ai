export async function generateWithAI(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY || "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";
  
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: "You are a TikTok Shop creative generator expert. Always respond with valid JSON only, no extra text." },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to generate");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) throw new Error("Empty response from AI");

  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;

  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new Error("Invalid JSON response");
  }
}