# Deployment Guide

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy a Next.js application.

### Step 1: Push to GitHub

```bash
git remote add origin https://github.com/yourusername/creative-scale-ai.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Click "Import"

### Step 3: Configure Environment Variables

In the Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add the following:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your production domain (e.g., `https://yourdomain.com`)

### Step 4: Deploy

Click "Deploy" and wait for the build to complete!

Your app will be available at `https://your-project.vercel.app`

---

## Deploy to Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./
COPY public ./public
COPY package.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t creative-scale-ai .
docker run -p 3000:3000 \
  -e OPENROUTER_API_KEY=your_key \
  -e NEXTAUTH_SECRET=your_secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  creative-scale-ai
```

---

## Deploy to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add environment variables in the dashboard
6. Deploy!

---

## Deploy to Self-Hosted VPS

### Prerequisites
- Ubuntu 20.04+ or similar Linux
- Node.js 18+
- npm

### Installation

```bash
# SSH into your server
ssh user@your-server.com

# Clone the repository
git clone https://github.com/yourusername/creative-scale-ai.git
cd creative-scale-ai

# Install dependencies
npm install

# Create .env.local
nano .env.local

# Add your environment variables:
# OPENROUTER_API_KEY=xxx
# NEXTAUTH_SECRET=xxx
# NEXTAUTH_URL=https://yourdomain.com

# Build the app
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start npm --name "creative-scale-ai" -- start
pm2 save
pm2 startup
```

### Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/creative-scale-ai

# Add this configuration:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/creative-scale-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate secure `NEXTAUTH_SECRET`
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Verify `OPENROUTER_API_KEY` is valid and has sufficient balance
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Setup database for persistent storage (optional)
- [ ] Setup Redis for distributed caching (optional)
- [ ] Configure monitoring and alerts
- [ ] Setup backup strategy
- [ ] Test error pages and rate limiting
- [ ] Configure CORS if needed for external clients

---

## Monitoring

### Check Health

```bash
curl https://yourdomain.com/api/health
```

### View Analytics

```bash
curl https://yourdomain.com/api/analytics
```

### Monitor Logs

```bash
# With PM2
pm2 logs creative-scale-ai

# With systemd
journalctl -u creative-scale-ai -f
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

### Memory Issues
- Increase Node memory: `NODE_OPTIONS="--max-old-space-size=2048" npm start`
- Reduce in-memory cache size in `src/lib/cache.ts`

### Slow Responses
- Check `/api/analytics` for slow requests
- Verify OpenRouter API is responding quickly
- Check network latency to OpenRouter

---

## Scaling

For high-traffic deployments:

1. **Database Integration**: Replace in-memory stores with PostgreSQL/MongoDB
2. **Redis Cache**: Use Redis for distributed caching
3. **Load Balancing**: Use multiple instances behind a load balancer
4. **CDN**: Add Cloudflare/AWS CloudFront for edge caching
5. **Worker Threads**: Implement for CPU-intensive operations

---

## Rollback

If deployment has issues:

```bash
# With Vercel: Automatic rollback available in dashboard
# With PM2:
pm2 revert

# Manual rollback:
git revert HEAD
npm run build
pm2 reload creative-scale-ai
```
