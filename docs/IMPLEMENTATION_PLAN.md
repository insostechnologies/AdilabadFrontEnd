# Implementation Plan: Adilabad App Cloud Migration (100GB DB Ready)

This plan details the end-to-end migration of the **Adilabad App** (React SPA Frontend + Express Node Backend + 100GB MySQL Database + Uploads) to a **100% Permanently Free Cloud Infrastructure**.

---

## Key Architecture Highlights

1. **Database Layer (Oracle Cloud Always Free)**: 4 ARM vCPUs, 24 GB RAM, and 200 GB SSD storage (100% free forever) hosting self-hosted MySQL 8.0 tuned with 16GB `innodb_buffer_pool_size`.
2. **Backend Layer (Render Web Service)**: Hosted Node.js/Express API with CORS and dynamic PORT binding. Keep-alive pings via UptimeRobot (Free) prevent sleep state.
3. **Frontend Layer (Vercel Global CDN)**: High-speed React SPA distribution with auto SSL.
4. **Media Layer (Cloudflare R2 / Oracle Object Storage)**: 10 GB free object storage with zero egress fees for image banners and product media.

---

## Migration Flow

```mermaid
flowchart TD
    A["1. Codebase Preparation"] --> B["2. Cloud DB Provisioning & Migration"]
    B --> C["3. Deploy Express API to Cloud Provider"]
    C --> D["4. Deploy React Frontend to Vercel / Cloudflare"]
    D --> E["5. Configure Custom Domain & SSL"]
    E --> F["6. Verification & End-to-End Testing"]
```
