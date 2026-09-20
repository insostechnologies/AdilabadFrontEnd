# Step-by-Step Deployment & Execution Runbook (Next Steps)
**Application**: Adilabad App (React SPA + Express Node API + 100GB MySQL DB + Heavy Media Layer)  
**Target Monthly Budget**: **$0 to $3.57 / Month**

---

## Phase 1: Merge GitHub Pull Requests

1. **Backend Pull Request**:
   * Open [https://github.com/insostechnologies/AdilabadBackEnd/pull/new/feature/cloud-migration](https://github.com/insostechnologies/AdilabadBackEnd/pull/new/feature/cloud-migration).
   * Click **Create Pull Request** -> **Merge Pull Request** -> **Confirm Merge**.
2. **Frontend Pull Request**:
   * Open [https://github.com/insostechnologies/AdilabadFrontEnd/pull/new/feature/cloud-migration](https://github.com/insostechnologies/AdilabadFrontEnd/pull/new/feature/cloud-migration).
   * Click **Create Pull Request** -> **Merge Pull Request** -> **Confirm Merge**.

---

## Phase 2: Oracle Cloud Account & Always Free VM Setup (Database)

1. **Register Account**:
   * Sign up at [oracle.com/cloud/free](https://www.oracle.com/cloud/free/).
   * Enter registration details and provide a valid credit/debit card for identity verification ($1 temporary authorization hold, refunded immediately).
2. **Launch Always Free Ampere Instance**:
   * In Oracle Console, go to **Compute > Instances > Create Instance**.
   * **Name**: `adilabad-mysql-db`
   * **Image**: `Ubuntu 22.04 LTS` (ARM64)
   * **Shape**: `VM.Standard.A1.Flex` -> Select **4 OCPUs, 24 GB RAM** (Look for the "Always Free Eligible" tag).
   * **Boot Volume**: Select **Customize Boot Volume Size** and set to **180 GB**.
   * **SSH Keys**: Download and save your Private Key file as `oracle.key`.
   * Click **Create**. Note your assigned **Public IP Address** (e.g. `129.146.x.x`).
3. **Configure VCN Network Security Rules**:
   * In Oracle Console, go to **Networking > Virtual Cloud Networks > Default Security List > Ingress Rules**.
   * Add Ingress Rule: Source `0.0.0.0/0`, Protocol `TCP`, Port `3306`.

---

## Phase 3: Oracle VM Configuration, MySQL 8.0 Tuning & Data Import

1. **SSH into Oracle VM**:
   ```bash
   chmod 400 oracle.key
   ssh -i oracle.key ubuntu@<ORACLE_PUBLIC_IP>
   ```
2. **Install & Tune MySQL 8.0**:
   ```bash
   sudo apt update && sudo apt install -y mysql-server
   ```
   Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:
   ```ini
   [mysqld]
   bind-address            = 0.0.0.0
   max_connections         = 250
   innodb_buffer_pool_size = 16G
   innodb_buffer_pool_instances = 8
   innodb_log_file_size    = 2G
   innodb_flush_log_at_trx_commit = 2
   ```
   Restart MySQL: `sudo systemctl restart mysql`
3. **Create Database & Import Dump**:
   ```sql
   CREATE DATABASE adilabadDb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'adilabaduser'@'%' IDENTIFIED BY 'YourStrongDBPassword123!';
   GRANT ALL PRIVILEGES ON adilabadDb.* TO 'adilabaduser'@'%';
   FLUSH PRIVILEGES;
   ```
   Stream local dump:
   ```bash
   mysqldump -u root -p --single-transaction --quick adilabadDb | gzip > adilabad_dump.sql.gz
   rsync -P -e "ssh -i oracle.key" adilabad_dump.sql.gz ubuntu@<ORACLE_PUBLIC_IP>:/home/ubuntu/
   gunzip -c adilabad_dump.sql.gz | mysql -u adilabaduser -pYourStrongDBPassword123! adilabadDb
   ```

---

## Phase 4: Deploy Express Backend API to Render

1. Log in to [Render.com](https://render.com).
2. Create **New Web Service** and select `insostechnologies/AdilabadBackEnd`.
3. Set Build Command: `npm install`, Start Command: `node index.js`.
4. Set Environment Variables (`ENV=prod`, `PORT=5000`, `DB_HOST=<ORACLE_PUBLIC_IP>`, `DB_USER`, `DB_PASSWORD`, `JWT_KEY_SECRET`, `URL_FRONTEND`).
5. Deploy and verify health check: `https://adilabad-backend.onrender.com/`.

---

## Phase 5: Deploy React SPA Frontend to Vercel

1. Log in to [Vercel.com](https://vercel.com).
2. Create **New Project** and import `insostechnologies/AdilabadFrontEnd`.
3. Set Framework: `Create React App`, Build Command: `npm run build`, Output Directory: `build`.
4. Set Environment Variables:
   * `REACT_APP_API_URL` = `https://adilabad-backend.onrender.com/`
   * `REACT_APP_FRONTEND_URL` = `https://www.adilabadapp.com/`
5. Deploy & point custom domain `adilabadapp.com` CNAME/A records to Vercel.

---

## Phase 6: Keep-Alive Monitor & Automated Backups

1. **Set Up UptimeRobot Ping**: Free 5-minute HTTP monitor targeting `https://adilabad-backend.onrender.com/` to eliminate Render sleep.
2. **Set Up Oracle VM Daily Backup Cron**: Automatically dumps `adilabadDb` daily at 2:00 AM.
