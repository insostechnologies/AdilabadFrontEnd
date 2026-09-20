# Enterprise Scaling Roadmap (Growth to 100K+ Users & 500GB+ DB)
**Application**: Adilabad Application (`AdilabadBackEnd` & `AdilabadFrontEnd`)

This document outlines the technical architecture considerations, caching strategies, database sharding, and microservices decomposition required to scale the Adilabad application beyond initial startup tier (25K MAU) up to **100,000+ Monthly Active Users** and **500 GB+ Database Datasets**.

---

## 🚀 Scaling Architecture Overview

```mermaid
flowchart TD
    subgraph Clients["Clients & Edge"]
        User[Browser / Mobile App]
        CloudflareEdge[Cloudflare Edge CDN<br/>Edge Cache HTML/JS & Images]
    end

    subgraph APICompute["Decoupled API Compute Layer"]
        LoadBalancer[Cloudflare Load Balancer]
        AuthService[Auth & User Service Node.js]
        CatalogService[Store & Product Catalog Service]
        OrderService[Order & Payment Service]
    end

    subgraph AsyncWorker["Background Queue Layer"]
        RedisQueue[BullMQ / Redis Queue]
        SMSWorker[SMS & Email Worker]
        ImageWorker[Media Optimization Worker]
    end

    subgraph DatabaseLayer["Scaled Database Layer"]
        RedisCache[Upstash / Redis Cache<br/>Hot Categories & Banners]
        MySQLPrimary[(MySQL 8.0 Primary DB<br/>Writes & Transactions)]
        MySQLReplica[(MySQL 8.0 Read Replica<br/>Read Queries)]
        R2Archive[Cloudflare R2 Storage<br/>Cold Data Archives & Media]
    end

    User --> CloudflareEdge
    CloudflareEdge --> LoadBalancer
    LoadBalancer --> AuthService
    LoadBalancer --> CatalogService
    LoadBalancer --> OrderService

    CatalogService -->|Cache First| RedisCache
    CatalogService -->|Cache Miss| MySQLReplica
    OrderService -->|Writes| MySQLPrimary
    AuthService -->|Enqueue SMS| RedisQueue
    
    RedisQueue --> SMSWorker
    RedisQueue --> ImageWorker
    ImageWorker --> R2Archive
```

---

## 1. Key Scaling Milestones

1. **Redis Caching Layer (Eliminate 80% DB Read Queries)**: Cache hot categories, banners, and search keywords in Upstash Redis.
2. **Background Job Queues (BullMQ + Redis)**: Offload SMS OTP sending, email notifications, and heavy image optimization tasks out-of-band to background workers.
3. **MySQL Primary-Replica Read/Write Splitting**: Route `SELECT` queries to Read Replicas and `INSERT/UPDATE` queries to Primary DB.
4. **Table Range Partitioning**: Partition `orders` table by year/month (`PARTITION BY RANGE (YEAR(created_at))`).
5. **Observability & APM**: Integrate Sentry for uncaught exception monitoring and k6 for load testing simulating 1,000 concurrent users.
