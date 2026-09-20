# Complete Project Architecture & Codebase Overview
**Project Name**: Adilabad Application  
**Repositories**: `AdilabadBackEnd` (Node.js/Express) & `AdilabadFrontEnd` (React 18 SPA)

---

## 1. Project Purpose & System Domain

The **Adilabad Application** is a full-stack local e-commerce, merchant directory, and marketplace platform serving the Adilabad region. It allows local merchants/stores to showcase products, run promotional banners, manage store categories, handle user registrations, and process customer inquiries.

---

## 2. Overall Technology Stack

```mermaid
flowchart LR
    subgraph Frontend["AdilabadFrontEnd (React 18 SPA)"]
        UI["Material UI v5 + Bootstrap 5"]
        Router["React Router v6"]
        RichText["CKEditor 5 & Material React Table"]
    end

    subgraph Backend["AdilabadBackEnd (Express REST API)"]
        Auth["JWT Authentication"]
        Upload["Multer + Sharp Image Optimizer"]
        SMS["Fast2SMS Service"]
        Validation["Express Validator & Emoji Guard"]
    end

    subgraph Database["Database & Cloud Infrastructure"]
        MySQL["MySQL 8.0 (adilabadDb)"]
        Storage["Oracle Object Storage / Cloudflare R2"]
    end

    Frontend -->|HTTP / JSON REST API| Backend
    Backend -->|TCP Connection Pool 3306| MySQL
    Backend -->|S3 Upload Stream| Storage
```

---

## 3. Backend Architecture (`AdilabadBackEnd`)

### Technology Stack
* **Runtime**: Node.js 20+
* **Web Framework**: Express v4.19
* **Database Driver**: `mysql` v2.18 (pooled connection architecture)
* **Security & Auth**: `jsonwebtoken` v9.0, `bcryptjs` v2.4
* **File Uploads & Image Processing**: `multer` v1.4, `sharp` v0.33 (WebP conversion), `@aws-sdk/client-s3` v3.500
* **SMS Gateway**: Fast2SMS API (`node-fetch` v3.3)
* **Validation**: `express-validator` v7.0, Emoji input sanitization middleware

---

## 4. Frontend Architecture (`AdilabadFrontEnd`)

### Technology Stack
* **Framework**: React 18.3 (Create React App structure)
* **UI Components**: `@mui/material` v5.15, `bootstrap` v5.3, `react-bootstrap` v2.10
* **Data Grids**: `material-react-table` v2.13 (Rich data filtering, pagination, sorting)
* **Rich Text Editing**: `@ckeditor/ckeditor5-react` v8.0 (Rich store descriptions)
* **Routing**: `react-router-dom` v6.23
* **Charts & Analytics**: `react-google-charts` v4.0
* **Notifications**: `react-toastify` v10.0

---

## 5. Entity Data Model (Database Schema Overview)

```mermaid
erDiagram
    ADMIN ||--o{ STORE : approves
    USER ||--o{ STORE : owns
    STORE ||--o{ PRODUCT : contains
    CATEGORY ||--o{ PRODUCT : categorizes
    STORE ||--o{ PROMOTION : runs
    BANNER }|--|| ADMIN : managed_by

    USER {
        int id PK
        string phone
        string password
        string name
        string role
    }

    STORE {
        int id PK
        int user_id FK
        string store_name
        string category_id
        string address
        string image_url
        string status
    }

    PRODUCT {
        int id PK
        int store_id FK
        string product_name
        decimal price
        string image_url
        string description
    }

    CATEGORY {
        int id PK
        string category_name
        string icon_url
    }
```
