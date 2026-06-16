# Langkah-Langkah Deployment VPS dengan Jenkins

Panduan deployment **bypur-web** portfolio ke VPS menggunakan Jenkins CI/CD Pipeline.

---

## ✅ Prerequisites (Sudah Terinstall)

- ✅ Docker
- ✅ Git
- ✅ Jenkins (running di port 9090 dengan `java -jar jenkins.war --httpPort=9090`)

---

## 📋 Spesifikasi VPS

```
CPU     : 1 Core
RAM     : 2 GB
Swap    : 4 GB (WAJIB!)
Storage : 40 GB SSD
OS      : Ubuntu 24.04 LTS
```

⚠️ **PENTING:** VPS ini low-spec (2GB RAM), jadi **WAJIB** pakai resource limits!

---

## 🚀 Langkah 1: Setup Swap Memory (Wajib!)

Swap memory mencegah crash saat build karena RAM habis.

```bash
# Cek swap yang ada
free -h

# Jika swap kurang dari 4GB, buat swap baru
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Verifikasi
free -h

# Buat permanent (auto-mount saat restart)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Set swappiness (optional, untuk optimasi)
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

---

## 🔧 Langkah 2: Konfigurasi Jenkins Memory Limit

Jenkins harus dibatasi memori agar tidak memakan semua RAM.

### A. Jika Jenkins Running dengan `jenkins.war`

Stop Jenkins terlebih dahulu, lalu jalankan dengan parameter memory:

```bash
# Stop Jenkins (Ctrl+C di terminal yang menjalankan)

# Jalankan dengan memory limit
java -Xms256m -Xmx512m -jar jenkins.war --httpPort=9090
```

**Penjelasan:**
- `-Xms256m` = Memory awal 256MB
- `-Xmx512m` = Memory maksimal 512MB (JANGAN LEBIH!)
- `--httpPort=9090` = Jenkins diakses di port 9090

### B. Setup Jenkins sebagai Service (Recommended)

Buat systemd service agar Jenkins auto-start saat VPS restart:

```bash
# Buat service file
sudo nano /etc/systemd/system/jenkins.service
```

Isi dengan:

```ini
[Unit]
Description=Jenkins CI/CD Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/jenkins
ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar /opt/jenkins/jenkins.war --httpPort=9090
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Simpan (Ctrl+X, Y, Enter), lalu:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (auto-start)
sudo systemctl enable jenkins

# Start Jenkins
sudo systemctl start jenkins

# Cek status
sudo systemctl status jenkins

# View logs
journalctl -u jenkins -f
```

---

## 🔌 Langkah 3: Install Plugin Jenkins yang Dibutuhkan

### Akses Jenkins

Buka browser: `http://VPS_IP:9090`

### Unlock Jenkins (Pertama Kali)

```bash
# Jika diminta password awal, ambil dari:
sudo cat /root/.jenkins/secrets/initialAdminPassword
```

### Install Plugin

**Manage Jenkins → Plugins → Available**

Install plugin berikut:

```
✅ Git Plugin              - Integrasi Git
✅ Pipeline               - Pipeline DSL
✅ Docker Pipeline        - Perintah Docker
✅ SSH Agent              - SSH deployment
✅ Credentials Binding    - Manajemen secret
✅ NodeJS Plugin          - Node.js installer
✅ GitHub Plugin          - GitHub webhook (optional)
```

Klik **Install** dan **Restart Jenkins** setelah selesai.

---

## 🔑 Langkah 4: Setup Credentials di Jenkins

### A. GitHub SSH Key

**Manage Jenkins → Credentials → System → Global credentials → Add Credentials**

```
Kind: SSH Username with private key
ID: github-ssh-key
Username: git
Private Key: Enter directly
  → Paste isi file ~/.ssh/id_rsa
Description: GitHub SSH Key
```

**Generate SSH Key (jika belum punya):**

```bash
# Generate key
ssh-keygen -t rsa -b 4096 -C "jenkins@bypur.my.id"

# Copy private key
cat ~/.ssh/id_rsa

# Copy public key (untuk di-add ke GitHub)
cat ~/.ssh/id_rsa.pub
```

**Add public key ke GitHub:**
1. GitHub → Settings → SSH and GPG keys → New SSH key
2. Paste public key dari `~/.ssh/id_rsa.pub`

### B. Environment Variables (Optional)

Untuk menyimpan environment variables seperti API URL:

**Manage Jenkins → Credentials → Add Credentials**

```
Kind: Secret text
ID: NEXT_PUBLIC_API_URL
Secret: https://api.bypur.my.id
Description: API URL
```

---

## 🛠️ Langkah 5: Setup Node.js di Jenkins

**Manage Jenkins → Tools → NodeJS installations → Add NodeJS**

```
Name: Node 20
Install automatically: ✅ (centang)
Version: NodeJS 20.x
```

**Global npm packages to install:**
```
pnpm@10.32.1
```

Save.

---

## 📦 Langkah 6: Buat Jenkins Pipeline Job

### A. Buat Job Baru

**Dashboard → New Item**

```
Item name: bypur-web-pipeline
Type: Pipeline
```

Klik **OK**.

### B. Konfigurasi Pipeline

**General:**
```
Description: CI/CD Pipeline untuk Bypur Portfolio
✅ GitHub project (centang)
Project url: https://github.com/bayupaths/bypur-web
```

**Build Triggers:**
```
✅ Poll SCM (centang)
Schedule: H/5 * * * *
(Cek perubahan setiap 5 menit)
```

**Pipeline:**
```
Definition: Pipeline script from SCM
SCM: Git
  Repository URL: git@github.com:bayupaths/bypur-web.git
  Credentials: github-ssh-key
  Branch Specifier: */main
Script Path: Jenkinsfile
```

Klik **Save**.

---

## 🔄 Langkah 7: Update Jenkinsfile untuk VPS

Pastikan Jenkinsfile di repository sudah benar. Berikut stage deployment yang sesuai:

```groovy
stage('Deploy') {
  steps {
    script {
      sh '''
        # Stop container lama
        docker stop bypur-portfolio || true
        docker rm bypur-portfolio || true
        
        # Jalankan container baru dengan MEMORY LIMIT
        docker run -d \
          --name bypur-portfolio \
          --memory="512m" \
          --cpus="0.5" \
          --restart=unless-stopped \
          -p 3000:3000 \
          -e NODE_ENV=production \
          -e NEXT_TELEMETRY_DISABLED=1 \
          bypur-portfolio:latest
        
        # Tunggu container start
        sleep 5
        
        # Health check
        curl -f http://localhost:3000 || exit 1
        
        echo "✓ Deployment berhasil!"
      '''
    }
  }
}
```

---

## 🌐 Langkah 8: Setup Nginx Reverse Proxy (Optional)

Nginx akan meng-expose port 3000 ke domain bypur.my.id.

### A. Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### B. Buat Konfigurasi Site

```bash
sudo nano /etc/nginx/sites-available/bypur.my.id
```

Isi dengan:

```nginx
server {
    listen 80;
    server_name bypur.my.id www.bypur.my.id;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### C. Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bypur.my.id /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test konfigurasi
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

### D. Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate SSL certificate
sudo certbot --nginx -d bypur.my.id -d www.bypur.my.id

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 🎯 Langkah 9: Test Build Manual

Sebelum full automation, test dulu secara manual.

### A. Test Build di Jenkins

1. Buka Jenkins: `http://VPS_IP:9090`
2. Klik job **bypur-web-pipeline**
3. Klik **Build Now**
4. Monitor **Console Output**

### B. Test Container

```bash
# Cek container running
docker ps

# Cek logs
docker logs -f bypur-portfolio

# Cek resource usage
docker stats bypur-portfolio

# Test akses
curl http://localhost:3000
```

### C. Test dari Browser

Buka: `http://bypur.my.id` atau `http://VPS_IP`

---

## 🤖 Langkah 10: Setup GitHub Webhook (Auto-Trigger)

Agar pipeline auto-trigger saat push ke GitHub.

### A. Konfigurasi di GitHub

**Repository → Settings → Webhooks → Add webhook**

```
Payload URL: http://VPS_IP:9090/github-webhook/
Content type: application/json
Secret: (kosongkan)
Which events? Just the push event
Active: ✅ (centang)
```

Klik **Add webhook**.

### B. Test Webhook

```bash
# Push perubahan ke GitHub
git add .
git commit -m "test: webhook trigger"
git push origin main

# Cek Jenkins Dashboard
# Pipeline harus otomatis trigger!
```

---

## 📊 Langkah 11: Monitoring & Maintenance

### A. Monitor Resources

```bash
# Install monitoring tools
sudo apt install htop -y

# Monitor real-time
htop

# Check memory
free -h

# Check disk
df -h

# Check Docker usage
docker stats
```

### B. Setup Daily Health Check

Buat script monitoring:

```bash
# Buat script
sudo nano /opt/monitor.sh
```

Isi dengan:

```bash
#!/bin/bash
echo "=== Health Check $(date) ==="
echo "Memory:"
free -h
echo ""
echo "Disk:"
df -h /
echo ""
echo "Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.CPUPerc}}\t{{.MemUsage}}"
echo ""
echo "Application Status:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000
```

Buat executable dan schedule:

```bash
# Make executable
chmod +x /opt/monitor.sh

# Test run
/opt/monitor.sh

# Add to cron (jalankan setiap 6 jam)
(crontab -l 2>/dev/null; echo "0 */6 * * * /opt/monitor.sh >> /var/log/health-check.log") | crontab -

# View cron jobs
crontab -l
```

### C. Setup Weekly Cleanup

```bash
# Buat cleanup script
sudo nano /opt/cleanup.sh
```

Isi dengan:

```bash
#!/bin/bash
echo "=== Weekly Cleanup $(date) ==="

# Remove unused Docker images
docker image prune -a -f

# Clean old logs
journalctl --vacuum-time=7d

# Clean apt cache
apt autoremove -y
apt clean

echo "Cleanup completed!"
```

Schedule:

```bash
chmod +x /opt/cleanup.sh

# Jalankan setiap Minggu jam 2 pagi
(crontab -l 2>/dev/null; echo "0 2 * * 0 /opt/cleanup.sh >> /var/log/cleanup.log") | crontab -
```

---

## ⚠️ Troubleshooting

### Problem 1: Jenkins Out of Memory

**Error:** `java.lang.OutOfMemoryError`

**Solusi:**
```bash
# Stop Jenkins
sudo systemctl stop jenkins

# Edit service (kurangi memory jika perlu)
sudo nano /etc/systemd/system/jenkins.service

# Ganti -Xmx512m menjadi -Xmx384m
# Reload dan start
sudo systemctl daemon-reload
sudo systemctl start jenkins
```

### Problem 2: Docker Container Crash

**Error:** Container terus restart

**Solusi:**
```bash
# Cek logs
docker logs bypur-portfolio

# Cek memory limit
docker inspect bypur-portfolio | grep -i memory

# Jika OOM, tambah memory limit
docker stop bypur-portfolio
docker rm bypur-portfolio

docker run -d \
  --name bypur-portfolio \
  --memory="768m" \
  --cpus="0.5" \
  --restart=unless-stopped \
  -p 3000:3000 \
  bypur-portfolio:latest
```

### Problem 3: Build Timeout di Jenkins

**Error:** Build stuck atau timeout

**Solusi:**
```bash
# 1. Cek resources
htop
docker stats

# 2. Restart Jenkins
sudo systemctl restart jenkins

# 3. Clear workspace
# Di Jenkins job → Workspace → Wipe Out Workspace

# 4. Manual cleanup
cd /root/.jenkins/workspace/bypur-web-pipeline
rm -rf node_modules .next
```

### Problem 4: Port 3000 Already in Use

**Error:** `bind: address already in use`

**Solusi:**
```bash
# Cari proses yang pakai port 3000
sudo lsof -i :3000
sudo netstat -tulpn | grep 3000

# Kill process
sudo kill -9 <PID>

# Atau stop container lama
docker stop bypur-portfolio
docker rm bypur-portfolio
```

### Problem 5: Nginx 502 Bad Gateway

**Error:** Nginx menampilkan 502 error

**Solusi:**
```bash
# 1. Cek container running
docker ps

# 2. Cek port 3000 terbuka
curl http://localhost:3000

# 3. Restart container
docker restart bypur-portfolio

# 4. Restart Nginx
sudo systemctl restart nginx

# 5. Cek Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📌 Command Reference Cepat

### Jenkins

```bash
# Start/Stop/Restart
sudo systemctl start jenkins
sudo systemctl stop jenkins
sudo systemctl restart jenkins

# Status dan logs
sudo systemctl status jenkins
journalctl -u jenkins -f
```

### Docker

```bash
# Lihat container
docker ps

# Stop/Remove container
docker stop bypur-portfolio
docker rm bypur-portfolio

# Build image
docker build -t bypur-portfolio:latest .

# Run container dengan limit
docker run -d \
  --name bypur-portfolio \
  --memory="512m" \
  --cpus="0.5" \
  -p 3000:3000 \
  bypur-portfolio:latest

# Logs
docker logs -f bypur-portfolio

# Stats
docker stats bypur-portfolio

# Cleanup
docker system prune -a
```

### Nginx

```bash
# Start/Stop/Reload
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl reload nginx

# Test config
sudo nginx -t

# Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### System Monitoring

```bash
# Memory
free -h

# Disk
df -h

# CPU & Memory detail
htop

# Proses
ps aux --sort=-%mem | head

# Network ports
sudo netstat -tulpn | grep LISTEN
```

---

## ✅ Checklist Deployment

**Setup Awal:**
- [x] VPS dengan Ubuntu 24.04
- [x] Docker terinstall
- [x] Git terinstall
- [x] Jenkins running di port 9090
- [ ] Swap memory 4GB aktif
- [ ] Jenkins memory limit 512MB
- [ ] Plugin Jenkins terinstall

**Konfigurasi:**
- [ ] GitHub SSH key di Jenkins
- [ ] Node.js 20 di Jenkins Tools
- [ ] Pipeline job dibuat
- [ ] Jenkinsfile sudah benar

**Deployment:**
- [ ] Build manual berhasil
- [ ] Container running di port 3000
- [ ] Nginx reverse proxy aktif
- [ ] SSL certificate terinstall
- [ ] GitHub webhook setup

**Monitoring:**
- [ ] Health check script
- [ ] Cleanup script
- [ ] Cron jobs aktif

---

## 🎉 Selesai!

Pipeline CI/CD sudah aktif! Setiap push ke `main` branch akan otomatis:

1. ✅ Trigger Jenkins pipeline
2. ✅ Run tests (lint + unit + integration)
3. ✅ Build Docker image
4. ✅ Deploy container baru
5. ✅ Website online di bypur.my.id

---

## 📚 Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Versi:** 1.0  
**Tanggal:** 2026-06-16  
**Penulis:** Bayu Purnomo  
**Project:** bypur-web Portfolio  
**VPS:** 1 Core | 2GB RAM | 40GB SSD  
**Jenkins:** Port 9090  
**Status:** Production Ready ✅
