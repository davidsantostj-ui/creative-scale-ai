import { generateWithAI } from "./openrouter";
import { scrapeProduct } from "./scraper";

export interface CreativeData {
  produto: {
    nome: string;
    preco: string;
    descricao: string;
    caracteristicas: string[];
  };
  descricaoTikTok: string;
  promptImagem: string;
  promptsVideo: {
    titulo: string;
    prompt: string;
    duracao: string;
  }[];
  hooks: string[];
  ctas: string[];
}

export async function generateCreative(link: string): Promise<CreativeData> {
  // Buscar dados do produto
  const productData = await scrapeProduct(link);
  
  const productInfo = `
Produto: ${productData.nome}
Preço: ${productData.preco}
Descrição: ${productData.descricao}
Características: ${productData.caracteristicas.join(", ") || "Qualidade premium, Melhor preço"}
  `.trim();

  const prompt = `Você é um expert em criativos virais para TikTok Shop.

BASE DO PRODUTO:
${productInfo}

GERE criativos UGC para este produto:

1. **DESCRIÇÃO TIKTOK** (4 linhas, linguagem natural, hashtags no final)

2. **PROMPT DE IMAGEM** (Primeiro frame para IA de vídeo/imagem):
- Em INGLÊS
- Ultra-realista
- Deve mostrar o produto EXATAMENTE como na foto original
- Estilo: produto em uso, fundo desfocado, luz natural
- Inclua: "DO NOT modify the product design, text, logo, or colors"

3. **3 PROMPTS DE VÍDEO** (8 segundos cada para Veo/Sora):
Cada prompt deve ser diferente:
- Vídeo 1: HOOK (primeiros 8 segundos)
- Vídeo 2: BENEFÍCIO (8 segundos)  
- Vídeo 3: PROVA SOCIAL (8 segundos)

REGRAS DOS VÍDEOS:
- Em INGLÊS
- Produto NÃO pode se mover/rotacionar
- Sem texto na tela
- Câmera estática ou POV leve
- Fundo real, luz natural
- Sem música (narração em PT)
- Duração: 8 segundos

4. **5 HOOKS** (aberturas virais)

5. **3 CTAs** (chamadas para ação)

RETORNE APENAS JSON:
{
  "produto": { "nome": "", "preco": "", "descricao": "", "caracteristicas": [] },
  "descricaoTikTok": "",
  "promptImagem": "",
  "promptsVideo": [{ "titulo": "", "prompt": "", "duracao": "8s" }],
  "hooks": [],
  "ctas": []
}`;

  const result = await generateWithAI(prompt);
  return result as CreativeData;
}