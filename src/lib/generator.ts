import { generateWithAI } from "./openrouter";

export interface CreativeData {
  produto: {
    nome: string;
    posicionamento: string;
    beneficios: string[];
  };
  descricao: string;
  roteiros: { variacao: string; video1: string; video2: string }[];
  promptImagem: string;
  promptsVideo: string[];
  hooksExtras: string[];
  ctasExtras: string[];
}

export async function generateCreative(link: string): Promise<CreativeData> {
  const prompt = `Gere criativos para TikTok Shop para o produto: ${link}

Retorne APENAS JSON válido com esta estrutura:
{
  "produto": { "nome": string, "posicionamento": string, "beneficios": string[] },
  "descricao": string,
  "roteiros": [{ "variacao": string, "video1": string, "video2": string }],
  "promptImagem": string,
  "promptsVideo": string[],
  "hooksExtras": string[],
  "ctasExtras": string[]
}

Regras:
- Roteiros em português brasileiro
- Foco em conversão e urgência
- Prompts de vídeo em inglês
- Hashtags no final da descrição`;

  const result = await generateWithAI(prompt);
  return result as CreativeData;
}