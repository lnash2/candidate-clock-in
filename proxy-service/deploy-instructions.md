
# Deployment Instructions

## Quick Deploy to Railway

1. **Fork or clone this repository**

2. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Choose the `proxy-service` folder as the root

3. **Set environment variables in Railway:**
   - Go to your service settings
   - Add environment variable: `PORT` (optional, Railway will set this automatically)

4. **Deploy:**
   - Railway will automatically build and deploy
   - Note the generated URL (e.g., `https://your-service.railway.app`)

5. **Add to Supabase:**
   - Go to your Supabase project settings
   - Add a new secret: `PROXY_SERVICE_URL` with the Railway URL

## Quick Deploy to Render

1. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure build settings:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `proxy-service`

3. **Deploy and get URL:**
   - Render will build and deploy automatically
   - Note the generated URL (e.g., `https://your-service.onrender.com`)

4. **Add to Supabase:**
   - Go to your Supabase project settings
   - Add a new secret: `PROXY_SERVICE_URL` with the Render URL

## Testing Your Deployment

Once deployed, test your proxy service:

```bash
# Health check
curl https://your-service-url.com/health

# Test connection (replace with your actual connection string)
curl -X POST https://your-service-url.com/test-connection \
  -H "Content-Type: application/json" \
  -d '{"connectionString": "postgresql://user:pass@host:5432/db"}'
```

## Next Steps

1. **Deploy the proxy service** using one of the methods above
2. **Add the PROXY_SERVICE_URL secret** to your Supabase project
3. **Test the connection** in your PCRM dashboard
4. **Start migrating data** with confidence!

The proxy service will handle all SSL certificate issues and provide much more reliable connections to your legacy database.
