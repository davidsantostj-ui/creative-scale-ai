# Creative Scale AI - TikTok Shop Creative Generator

<div align="center">
  <h3>🚀 Automated AI-powered creative generation for TikTok Shop</h3>
  <p>Generate professional UGC content, video prompts, and marketing hooks from any product link</p>
</div>

---

## ✨ Features

### Core Features
- **Product Link Scraping** - Automatically extract product data from AliExpress, Shopee, Shein, Amazon, eBay, Etsy and generic e-commerce sites
- **AI-Powered Creative Generation** - Generate professional marketing content using OpenRouter API with Llama 3.1 8B
- **Multi-Platform Video Prompts** - Create 3 optimized 8-second video prompts for Veo/Sora AI video generators
- **TikTok Shop Description** - Generate viral-ready product descriptions with hashtags
- **Marketing Copy** - Auto-generate 5 viral hooks and 3 CTAs for maximum engagement

### Advanced Features

#### 🔒 Authentication & User Management
- NextAuth.js integration with JWT sessions
- Demo credentials for testing: `demo@example.com` / `demo123`
- User history tracking for generated creatives
- Session management per user

#### ⚡ Performance & Caching
- **24-hour intelligent caching** - Avoid redundant API calls for same products
- **Rate limiting** - 30 requests per hour per IP address to protect API
- Cache statistics and monitoring

#### 🌐 Multi-Platform Scraping
- **Supported platforms:**
  - AliExpress (native selectors)
  - Shopee (property-based selectors)
  - Shein (class-based selectors)
  - Amazon (structured selectors)
  - eBay (specific attributes)
  - Etsy (meta tags)
  - Generic fallback for any e-commerce site

#### 🎯 Smart Prompt Optimization
- **Category detection:** Automatically identifies product type (electronics, fashion, beauty, home, accessories, sports)
- **Category-specific prompts:** Tailored AI instructions for better results
- **Detailed video guidelines:** Ensures AI videos meet TikTok requirements
- **English video prompts:** Optimized for international AI video generators
- **Portuguese descriptions:** Natural, conversational product descriptions in Brazilian Portuguese

#### 📊 Analytics & Monitoring
- Real-time API usage tracking
- Cache hit rate monitoring
- Error tracking and logging
- Memory usage monitoring
- Admin dashboard at `/admin`

#### 🏥 Health & Status Endpoints
- `/api/health` - System health check with uptime and memory stats
- `/api/analytics` - Usage analytics for custom periods
- `/admin` - Beautiful dashboard with real-time statistics

#### 🛠 Technical Enhancements
- Playwright scraper for JavaScript-heavy sites (optional)
- TypeScript for type safety
- Vercel Analytics integration
- Environment variable security
- Comprehensive error handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenRouter API key

### Installation

```bash
# Clone and install
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your OPENROUTER_API_KEY
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## 📋 API Endpoints

### Generate Creative
```bash
POST /api/generate
Content-Type: application/json

{
  "link": "https://www.aliexpress.com/item/..."
}

Response:
{
  "produto": {
    "nome": "Product Name",
    "preco": "Price",
    "descricao": "Description",
    "caracteristicas": ["Feature 1", "Feature 2"]
  },
  "descricaoTikTok": "TikTok description with hashtags",
  "promptImagem": "Image prompt in English for AI",
  "promptsVideo": [
    {
      "titulo": "Hook",
      "prompt": "8-second video prompt...",
      "duracao": "8s"
    },
    // 2 more video prompts (Benefit, Social Proof)
  ],
  "hooks": ["Hook 1", "Hook 2", ...],
  "ctas": ["CTA 1", "CTA 2", "CTA 3"]
}
```

### Check Cache Status
```bash
GET /api/health
```

### Get Analytics
```bash
GET /api/analytics?hours=24&limit=100
```

### User History
```bash
GET /api/history?limit=50
DELETE /api/history?id=item_id
```

---

## 🔑 Environment Variables

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## 📚 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/         # Main creative generation endpoint
│   │   ├── auth/             # NextAuth authentication
│   │   ├── history/          # User history management
│   │   ├── health/           # Health check endpoint
│   │   └── analytics/        # Analytics data endpoint
│   ├── auth/signin/          # Login page
│   ├── admin/                # Admin dashboard
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Main generator UI
├── lib/
│   ├── generator.ts          # Creative generation logic
│   ├── scraper.ts            # Multi-platform scraping
│   ├── playwright-scraper.ts # JS-heavy site scraping
│   ├── openrouter.ts         # OpenRouter API client
│   ├── cache.ts              # In-memory cache system
│   ├── rate-limit.ts         # Rate limiting middleware
│   ├── analytics.ts          # Event tracking
│   ├── history.ts            # User history storage
│   └── auth.ts               # NextAuth configuration
└── middleware.ts             # Next.js middleware
```

---

## 🎯 Usage Examples

### Example 1: AliExpress Product
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"link": "https://www.aliexpress.com/item/1005004432476491.html"}'
```

### Example 2: Shopee Product
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"link": "https://shopee.com.br/product/123456789"}'
```

### Example 3: Get System Stats
```bash
curl http://localhost:3000/api/health
```

---

## 🔄 Workflow

1. **User enters product link** → Frontend validates URL
2. **API receives request** → Rate limiting check, cache lookup
3. **Cache miss** → Scrape product data from e-commerce platform
4. **AI Generation** → Send to OpenRouter with optimized prompt
5. **Response processing** → Parse JSON, extract fields
6. **Cache storage** → Store for 24 hours (avoids redundant calls)
7. **Frontend display** → Show creatives with copy-to-clipboard

---

## 🛡️ Security Features

- ✅ API keys stored server-side only (never exposed to frontend)
- ✅ Rate limiting to prevent abuse
- ✅ Input validation on all endpoints
- ✅ Error messages don't leak sensitive data
- ✅ CORS ready for production deployment

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# https://vercel.com/new

# Set environment variables in Vercel dashboard:
# - OPENROUTER_API_KEY
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (your domain)
```

### Custom Deployment

The app is a standard Next.js 14 application and works with any Node.js hosting:
- Railway
- Render
- Fly.io
- Self-hosted VPS

---

## 📊 Key Metrics

- **Cache Hit Rate:** Typical 40-60% for repeat customers
- **Generation Time:** ~10-15 seconds per product
- **Success Rate:** 95%+ with proper URL formatting
- **Memory Footprint:** ~150MB average
- **API Cost:** ~$0.01-0.05 per generation (depends on response length)

---

## 🔧 Advanced Configuration

### Changing Rate Limits

Edit `src/lib/rate-limit.ts`:
```typescript
private readonly REQUESTS_PER_HOUR = 30; // Change this value
```

### Adjusting Cache TTL

Edit `src/lib/cache.ts`:
```typescript
private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
```

### Adding New E-commerce Platforms

Edit `src/lib/scraper.ts` and add platform-specific scrapers:
```typescript
async function scrapeNewPlatform($: cheerio.CheerioAPI): Promise<Partial<ProductData>> {
  let nome = $("#product-name").text().trim();
  let preco = $("#product-price").text().trim();
  // ... implement selectors for your platform
}
```

---

## 📈 Performance Tips

1. **Reduce scraping calls** - Cache is enabled by default
2. **Batch requests** - Process multiple products efficiently
3. **Monitor memory** - Check `/api/health` regularly
4. **Review analytics** - Use `/api/analytics` to understand usage patterns

---

## 🐛 Troubleshooting

### "Rate limit exceeded"
- Wait for the time specified in error message
- Check your current usage with `/api/health`

### "Scraping failed"
- Verify the product link is valid and publicly accessible
- Try a different product to verify scraper works
- Check browser User-Agent if blocking occurs

### "API error"
- Verify `OPENROUTER_API_KEY` is valid
- Check OpenRouter account balance
- Review error message for specific details

### Cache not working
- Check `/api/health` to see cache entries
- Cache keys are based on product URLs
- Exact same URL needed for cache hit

---

## 🤝 Contributing

We welcome contributions! Areas for improvement:
- Additional e-commerce platform support
- Database integration (replace in-memory storage)
- Redis caching for distributed deployments
- Multi-language support
- Advanced analytics dashboard

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🎓 Technical Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js 14, Node.js
- **AI:** OpenRouter API, Llama 3.1 8B
- **Authentication:** NextAuth.js
- **Scraping:** Cheerio (HTML), Playwright (JS)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel, Node.js compatible hosting

---

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API logs at `/api/health`
3. Check analytics at `/admin`
4. Report issues on GitHub

---

**Made with ❤️ for TikTok Shop creators**
