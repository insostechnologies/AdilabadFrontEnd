# Comprehensive Deep-Dive Architecture & Implementation Blueprint
**Application**: Adilabad Application (React SPA + Node.js Express API + 100GB MySQL DB + Heavy Media Layer)  
**Target Budget**: **$0 to $1.35/month**  
**Target Architecture**: Vercel (Frontend) + Render (Backend API) + Oracle Cloud Always Free (100GB MySQL DB) + Cloudflare R2 / Oracle Object Storage

---

## Table of Contents
1. [Module 1: End-to-End Architecture & Network Traffic Flow](#module-1-end-to-end-architecture--network-traffic-flow)
2. [Module 2: 100 GB MySQL Database Deep-Dive (Oracle Cloud VM)](#module-2-100-gb-mysql-database-deep-dive-oracle-cloud-vm)
3. [Module 3: Heavy Media Optimization & CDN Pipeline](#module-3-heavy-media-optimization--cdn-pipeline)
4. [Module 4: Codebase Refactoring Specifications](#module-4-codebase-refactoring-specifications)
5. [Module 5: Step-by-Step Deployment Runbook](#module-5-step-by-step-deployment-runbook)
6. [Module 6: Operations, Backups & Disaster Recovery](#module-6-operations-backups--disaster-recovery)

---

## Module 1: End-to-End Architecture & Network Traffic Flow

### 1. Architectural Topology

```mermaid
flowchart TD
    subgraph Clients["Client Layer"]
        Browser["User Browser / Mobile Device"]
    end

    subgraph Edge["Global Edge & CDN Layer ($0/mo)"]
        VercelCDN["Vercel Global Edge CDN<br/>Serves Compiled React SPA<br/>Auto SSL / TLS 1.3"]
        CloudflareCDN["Cloudflare Global CDN<br/>Serves WebP Images from R2<br/>Cache-Control: 1 Year"]
    end

    subgraph Application["Compute Layer ($0/mo)"]
        RenderAPI["Render Web Service<br/>Node.js 20 Express API<br/>Sharp WebP Image Pipeline<br/>Keep-Alive via UptimeRobot"]
    end

    subgraph Storage["Storage & Database Layer ($0 to $1.35/mo)"]
        OracleVM["Oracle Cloud Always Free VM<br/>4 OCPU ARM Ampere A1 | 24 GB RAM<br/>180 GB NVMe SSD<br/>MySQL 8.0 Engine (16GB Buffer Pool)"]
        R2Storage["Cloudflare R2 Object Storage<br/>10 GB Free | $0.015/GB beyond<br/>$0.00 Egress Bandwidth Fees"]
    end

    Browser -->|1. Load HTML/JS/CSS| VercelCDN
    Browser -->|2. REST API Requests HTTPS| RenderAPI
    RenderAPI -->|3. TCP Connection Pool 3306| OracleVM
    RenderAPI -->|4. Stream WebP Uploads| R2Storage
    Browser -->|5. Load Images HTTPS| CloudflareCDN
    CloudflareCDN -->|Cache Miss| R2Storage
```
