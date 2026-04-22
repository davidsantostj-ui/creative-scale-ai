import axios from "axios";
import * as cheerio from "cheerio";

interface ProductData {
  nome: string;
  preco: string;
  descricao: string;
  caracteristicas: string[];
  avaliacoes: string[];
  imagem: string;
  url: string;
}

export async function scrapeProduct(url: string): Promise<ProductData> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    
    // AliExpress
    let nome = $("h1[data-spm='product_title'], h1.product-title, .product-title h1").text().trim();
    let preco = $(".product-price-value, .price, .price-current").text().trim();
    let descricao = $(".product-description, .product-detail-description, [data-spm='product_description']").text().trim();
    let imagem = $(".product-image img, .gallery-image img").first().attr("src") || "";
    
    if (!nome) nome = $("h1").first().text().trim();
    if (!preco) preco = $("[class*='price']").first().text().trim();
    if (!descricao) descricao = $("meta[name='description']").attr("content") || "";

    return {
      nome: nome || "Produto TikTok",
      preco: preco || "R$ 0,00",
      descricao: descricao || "Excelente produto com ótima qualidade.",
      caracteristicas: extractFeatures($, url),
      avaliacoes: [],
      imagem,
      url,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return {
      nome: "Produto",
      preco: "",
      descricao: "",
      caracteristicas: [],
      avaliacoes: [],
      imagem: "",
      url,
    };
  }
}

function extractFeatures($: cheerio.CheerioAPI, url: string): string[] {
  const features: string[] = [];
  
  $("[class*='feature'], [class*='spec']").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length < 200) features.push(text);
  });

  if (features.length === 0 && url.includes("aliexpress")) {
    features.push("Qualidade premium");
    features.push("Envio rápido");
    features.push("Melhor preço");
  }

  return features.slice(0, 5);
}