# Adilabad Frontend Cloud Migration & Deployment Guide

This document contains instructions for deploying the **Adilabad React SPA Frontend** to Vercel, Netlify, or Cloudflare Pages.

---

## 1. Environment Variable Reference

Create these environment variables in your deployment dashboard (e.g., Vercel Project Settings > Environment Variables):

| Key | Description | Production Example | Development Example |
| :--- | :--- | :--- | :--- |
| `REACT_APP_API_URL` | Live backend API base URL | `https://adilabad-backend.onrender.com/` | `http://localhost:5000/` |
| `REACT_APP_FRONTEND_URL` | Live frontend domain URL | `https://www.adilabadapp.com/` | `http://localhost:3000/` |

---

## 2. Local Production Build Testing

To test the production build locally before deploying:

```bash
# 1. Install dependencies if needed
npm install

# 2. Generate optimized static build
npm run build

# 3. Serve build output locally
npx serve -s build -l 3000
```

---

## 3. Deployment Steps (Vercel - Recommended)

1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New > Project** and import the `AdilabadFrontEnd` GitHub repository.
3. Configure settings:
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add Environment Variables:
   - `REACT_APP_API_URL` = `https://adilabad-backend.onrender.com/`
   - `REACT_APP_FRONTEND_URL` = `https://www.adilabadapp.com/`
5. Click **Deploy**.

---

## 4. Custom Domain Setup (DNS Config)

To point `adilabadapp.com` to your Vercel deployment:

* **CNAME Record**: `www` -> `cname.vercel-dns.com`
* **A Record**: `@` -> `76.76.21.21`

Vercel will automatically issue and renew free SSL certificates (TLS 1.3).
