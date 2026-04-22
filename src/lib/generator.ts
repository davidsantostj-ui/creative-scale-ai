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

// Optimized prompt templates for different product categories
const CATEGORY_PROMPTS: Record<string, string> = {
  electronics: `Focus on tech specs and practical benefits. Emphasize innovation and quality.`,
  fashion: `Highlight style, comfort, and versatility. Use aspirational language and trends.`,
  beauty: `Emphasize transformation, results, and confidence. Use lifestyle imagery.`,
  home: `Focus on comfort, aesthetics, and functionality. Show real-life usage scenarios.`,
  accessories: `Highlight style complement and everyday usability. Show product versatility.`,
  sports: `Emphasize performance, durability, and athletic achievement. Show active use.`,
  default: `Focus on quality, value, and practical benefits. Show product in realistic scenarios.`,
};

function categorizeProduct(productName: string, description: string): string {
  const text = `${productName} ${description}`.toLowerCase();
  
  if (text.match(/\b(phone|laptop|computer|camera|headphone|speaker|watch|tablet)\b/)) return "electronics";
  if (text.match(/\b(shirt|pants|dress|jacket|shoe|sock|hat|belt|scarf)\b/)) return "fashion";
  if (text.match(/\b(cream|serum|lotion|makeup|lipstick|mascara|perfume|shampoo)\b/)) return "beauty";
  if (text.match(/\b(chair|table|bed|lamp|pillow|cushion|rug|mirror)\b/)) return "home";
  if (text.match(/\b(ring|necklace|bracelet|earring|watch|pendant|keychain)\b/)) return "accessories";
  if (text.match(/\b(ball|racket|bike|shoes|gloves|weights|mat|bag)\b/)) return "sports";
  
  return "default";
}

export async function generateCreative(link: string): Promise<CreativeData> {
  // Buscar dados do produto
  const productData = await scrapeProduct(link);
  
  // Detectar categoria para prompt otimizado
  const category = categorizeProduct(productData.nome, productData.descricao);
  const categoryPrompt = CATEGORY_PROMPTS[category];

  const productInfo = `
Produto: ${productData.nome}
Preço: ${productData.preco}
Descrição: ${productData.descricao}
Características: ${productData.caracteristicas.join(", ") || "Qualidade premium, Melhor preço"}
Plataforma: ${productData.plataforma || "e-commerce"}
Categoria: ${category}
  `.trim();

  const prompt = `Você é um expert MASTER em criativos virais UGC para TikTok Shop com milhões de visualizações.

CONTEXTO DO PRODUTO:
${productInfo}

DIRECIONAMENTO ESPECIAL:
${categoryPrompt}

INSTRUÇÕES CRÍTICAS:

1. **DESCRIÇÃO TIKTOK** (máximo 4 linhas, linguagem natural e conversacional)
   - Começar com curiosidade ou benefício direto
   - Incluir 2-3 hashtags relevantes no final
   - Tom: amigável, direto, envolvente

2. **PROMPT DE IMAGEM** (Primeiro frame ultra-realista para IA)
   - OBRIGATORIAMENTE em INGLÊS
   - Incluir: "Photo realistic, professional lighting, natural colors"
   - Mencionar: "DO NOT modify the product design, text, logo, or colors"
   - Detalhar: iluminação, ângulo, fundo (sempre desfocado)
   - Exemplo visual: "product on white background, soft natural lighting, premium photography"

3. **3 PROMPTS DE VÍDEO** (8 segundos EXATOS cada, para Veo/Sora/similar)
   - OBRIGATORIAMENTE em INGLÊS
   - Vídeo 1 (HOOK): Abertura impactante - primeiros 2 segundos decisivos
   - Vídeo 2 (BENEFÍCIO): Mostrar valor/uso prático - problema + solução
   - Vídeo 3 (PROVA SOCIAL): Satisfação/resultado/validação

   REGRAS ABSOLUTES DOS VÍDEOS:
   - Produto NUNCA pode se mover, rotacionar ou mudar de posição
   - SEM texto na tela (sem subtítulos, sem overlays)
   - Câmera: estática ou movimento POV SUAVE (máximo 10°)
   - Fundo: real, natural, bem iluminado (não branco/genérico)
   - Pessoas: se aparecer, ações naturais e não forçadas
   - Sem efeitos ou transições
   - 8 segundos = ~24-32 frames (filme rápido mas legível)

4. **5 HOOKS VIRAIS** (aberturas que fazem parar)
   - Tom: Pergunta provocante, afirmação ousada, ou curiosidade
   - Linguagem: português brasileiro natural
   - Objetivo: fazer PARAR a rolagem

5. **3 CTAs CONVERSORES** (chamadas para ação)
   - Sem clichês ("clica agora", "compre já")
   - Direto: "vê só", "toma", "deixa eu mostrar"
   - Criar urgência ou exclusividade

RETORNE APENAS JSON VÁLIDO (sem markdown, sem explicações):
{
  "produto": { "nome": "", "preco": "", "descricao": "", "caracteristicas": [] },
  "descricaoTikTok": "",
  "promptImagem": "",
  "promptsVideo": [
    { "titulo": "Hook", "prompt": "", "duracao": "8s" },
    { "titulo": "Benefício", "prompt": "", "duracao": "8s" },
    { "titulo": "Prova Social", "prompt": "", "duracao": "8s" }
  ],
  "hooks": ["", "", "", "", ""],
  "ctas": ["", "", ""]
}`;

  const result = await generateWithAI(prompt);
  return result as CreativeData;
}