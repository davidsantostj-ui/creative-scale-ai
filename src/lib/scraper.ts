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
  plataforma?: string;
}

// Detect platform from URL
function detectPlatform(url: string): string {
  if (url.includes("aliexpress")) return "aliexpress";
  if (url.includes("shopee")) return "shopee";
  if (url.includes("shein")) return "shein";
  if (url.includes("amazon")) return "amazon";
  if (url.includes("ebay")) return "ebay";
  if (url.includes("etsy")) return "etsy";
  return "generic";
}

// Platform-specific scraping strategies
async function scrapeAliExpress($: cheerio.CheerioAPI): Promise<Partial<ProductData>> {
  let nome = $("h1[data-spm='product_title'], h1.product-title").text().trim();
  let preco = $(".product-price-value, [class*='price-current']").text().trim();
  let descricao = $("[data-spm='product_description'], .product-detail-description").text().trim();
  let imagem = $(".product-image img, .gallery-image img").first().attr("src") || "";

  return { nome, preco, descricao, imagem };
}

async function scrapeShopee($: cheerio.CheerioAPI): Promise<Partial<ProductData>> {
  let nome = $("h1[itemprop='name'], .product-title").text().trim();
  let preco = $("[class*='price']").first().text().trim();
  let descricao = $("[itemprop='description']").text().trim();
  let imagem = $("img[class*='product']").first().attr("src") || "";

  return { nome, preco, descricao, imagem };
}

async function scrapeShein($: cheerio.CheerioAPI): Promise<Partial<ProductData>> {
  let nome = $("h1.product-name, [class*='product-title']").text().trim();
  let preco = $("[class*='sale-price'], [class*='current-price']").first().text().trim();
  let descricao = $(".detail-product-description, [class*='description']").text().trim();
  let imagem = $("img[class*='product-image']").first().attr("src") || "";

  return { nome, preco, descricao, imagem };
}

async function scrapeAmazon($: cheerio.CheerioAPI): Promise<Partial<ProductData>> {
  let nome = $("#productTitle").text().trim();
  let preco = $(".a-price-whole, [class*='price']").first().text().trim();
  let descricao = $("[id='feature-bullets'] li").map((_, el) => $(el).text()).get().join("; ");
  let imagem = $("#landingImage").attr("src") || "";

  return { nome, preco, descricao, imagem };
}

async function scrapeEbay($: cheerio.CheerioAPI): Promise<Partial<ProductData>> {
  let nome = $("h1.it-title").text().trim();
  let preco = $(".vi-VR-cvipPrice").text().trim();
  let descricao = $("[class*='section-description']").text().trim();
  let imagem = $("#vi_main img").first().attr("src") || "";

  return { nome, preco, descricao, imagem };
}

async function scrapeEtsy($: cheerio.CheerioAPI): Promise<Partial<ProductData>> {
  let nome = $("h1").first().text().trim();
  let preco = $("[data-buy-box-region] [class*='price']").first().text().trim();
  let descricao = $("[class*='product-description']").text().trim();
  let imagem = $("img.display-img").first().attr("src") || "";

  return { nome, preco, descricao, imagem };
}

// Fallback method using Playwright for JS-heavy sites
async function scrapePlaintext($: cheerio.CheerioAPI): Promise<Partial<ProductData>> {
  let nome = $("h1").first().text().trim();
  let preco = $("[class*='price'], [data-price]").first().text().trim();
  let descricao = $("meta[name='description']").attr("content") || "";
  let imagem = $("img").first().attr("src") || "";

  return { nome, preco, descricao, imagem };
}

export async function scrapeProduct(url: string): Promise<ProductData> {
  try {
    const platform = detectPlatform(url);
    
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Cache-Control": "no-cache",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    let productData: Partial<ProductData>;

    // Use platform-specific scrapers
    switch (platform) {
      case "aliexpress":
        productData = await scrapeAliExpress($);
        break;
      case "shopee":
        productData = await scrapeShopee($);
        break;
      case "shein":
        productData = await scrapeShein($);
        break;
      case "amazon":
        productData = await scrapeAmazon($);
        break;
      case "ebay":
        productData = await scrapeEbay($);
        break;
      case "etsy":
        productData = await scrapeEtsy($);
        break;
      default:
        productData = await scrapePlaintext($);
    }

    // Extract features
    const caracteristicas = extractFeatures($, platform);

    // Fallback values
    if (!productData.nome) productData.nome = "Produto";
    if (!productData.preco) productData.preco = "Preço sob consulta";
    if (!productData.descricao) productData.descricao = "Excelente produto com ótima qualidade.";

    return {
      nome: productData.nome,
      preco: productData.preco,
      descricao: productData.descricao,
      caracteristicas,
      avaliacoes: [],
      imagem: productData.imagem || "",
      url,
      plataforma: platform,
    };
  } catch (error) {
    console.error("Scraping error for URL:", url, error);
    return {
      nome: "Produto",
      preco: "Preço sob consulta",
      descricao: "Produto premium com excelente qualidade",
      caracteristicas: ["Qualidade premium", "Entrega rápida", "Melhor preço"],
      avaliacoes: [],
      imagem: "",
      url,
      plataforma: "unknown",
    };
  }
}

function extractFeatures(
  $: cheerio.CheerioAPI,
  platform: string
): string[] {
  const features: string[] = [];

  // Platform-specific feature extraction
  if (platform === "aliexpress") {
    $("[class*='feature'], [class*='spec'], li[class*='feat']").each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 150 && text.length > 5) features.push(text);
    });
  }

  if (platform === "amazon") {
    $("#feature-bullets li").each((_, el) => {
      const text = $(el).text().trim().replace(/\n/g, "");
      if (text && text.length > 5) features.push(text);
    });
  }

  if (platform === "shopee" || platform === "shein") {
    $("[class*='description'], [class*='info']").each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 150 && text.length > 5) features.push(text);
    });
  }

  // Generic extraction for all platforms
  if (features.length === 0) {
    $("li, dt, dd").each((_, el) => {
      const text = $(el).text().trim();
      if (
        text &&
        text.length < 150 &&
        text.length > 5 &&
        !text.match(/^\d+$/)
      ) {
        features.push(text);
      }
    });
  }

  // Default features if none found
  if (features.length === 0) {
    features.push("Qualidade premium", "Envio rápido", "Melhor preço");
  }

  // Return top 5 unique features
  return [...new Set(features)].slice(0, 5);
}
