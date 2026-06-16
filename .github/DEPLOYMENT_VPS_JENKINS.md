# VPS Deployment Guide - Jenkins CI/CD Pipeline

Complete production deployment documentation for **bypur-web** portfolio on low-spec VPS with Jenkins automation.

---

## 📋 1. Project Overview

**bypur-web** is a modern portfolio website built with:
- **Framework**: Next.js 16.2.9 (React 19)
- **Runtime**: Node.js 20
- **Package Manager**: pnpm 10.32.1
- **Styling**: Tailwind CSS v4
- **Testing**: Jest (98 tests) + Playwright E2E

**Deployment Strategy:**
- **Containerization**: Docker multi-stage build
- **CI/CD**: Jenkins Pipeline (9 stages)
- **Reverse Proxy**: Nginx
- **Domain**: bypur.my.id
- **Port**: 3000 (internal), 80/443 (external)

This deployment uses **Docker containers** orchestrated by **Jenkins CI/CD** pipeline, optimized for **low-resource VPS environments**.

---

## 🖥️ 2. VPS Specification

### Hardware Requirements

```
┌─────────────────────────────────────┐
│  VPS Specification (Minimum)        │
├─────────────────────────────────────┤
│  CPU     : 1 Core                   │
│  RAM     : 2 GB                     │
│  Swap    : 4 GB (REQUIRED)          │
│  Storage : 40 GB SSD                │
│  OS      : Ubuntu 24.04 LTS         │
└─────────────────────────────────────┘
```

### Critical Limitations

⚠️ **This is a LOW MEMORY environment!**

**What this means:**
- **Memory pressure** is real - only 2GB RAM available
- Must use **resource limits** on ALL containers
- **Cannot run heavy services** simultaneously:
  - ❌ SonarQube (requires 2GB+ RAM alone)
  - ❌ Elasticsearch
  - ❌ Full database servers (PostgreSQL, MySQL)
  - ❌ Redis clusters
  - ❌ Multiple concurrent builds

**What you CAN run:**
- ✅ Jenkins (with memory limits: 512MB max)
- ✅ Single Docker container (512MB limit)
- ✅ Nginx (lightweight, <50MB)
- ✅ Small SQLite databases
- ✅ Static file serving

**Swap Memory (4GB) is MANDATORY:**
- Acts as overflow when RAM fills up
- Prevents OOM (Out of Memory) kills
- Allows builds to complete without crashing

---

## 🛠️ 3. Required Stack

### Core Services

```
┌──────────────┬──────────────────────────────────────┐
│  Service     │  Purpose                             │
├──────────────┼──────────────────────────────────────┤
│  Docker      │  Container runtime                   │
│  Jenkins     │  CI/CD automation server             │
│  Nginx       │  Reverse proxy (optional)            │
│  Git         │  Version control                     │
│  Node.js 20  │  Build stage only (in Docker)        │
└──────────────┴──────────────────────────────────────┘
```

### Installation Commands

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose -y

# Install Java (for Jenkins)
sudo apt install openjdk-17-jdk -y

# Install Jenkins
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install jenkins -y

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Verify installations
docker --version
docker-compose --version
java --version
jenkins --version
nginx -v
git --version
```

---

## 🏗️ 4. Architecture Diagram

### Deployment Flow (ASCII)

```
┌──────────────────────────────────────────────────────────────────┐
│                     PRODUCTION ARCHITECTURE                       │
└──────────────────────────────────────────────────────────────────┘

Developer Push
      │
      ▼
┌──────────────┐
│   GitHub     │  Repository: bayupaths/bypur-web
│   (Remote)   │  Branch: main
└──────┬───────┘
       │ Webhook
       │ (on push)
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                         JENKINS SERVER                            │
│  Memory: 512MB | CPU: 0.5 core | Port: 8080                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Stage 1: Checkout    → Clone repository from GitHub             │
│  Stage 2: Setup       → Install dependencies (pnpm install)      │
│  Stage 3: Lint        → ESLint validation                        │
│  Stage 4: Unit Tests  → Jest unit tests                          │
│  Stage 5: Integration → Integration tests                        │
│  Stage 6: Build       → Next.js production build                 │
│  Stage 7: Docker      → Build Docker image                       │
│  Stage 8: Deploy      → Stop old + Run new container             │
│                                                                   │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ Deploy
                            ▼
              ┌──────────────────────────┐
              │   DOCKER IMAGE BUILD     │
              │  bypur-portfolio:latest  │
              └──────────┬───────────────┘
                         │
                         │ Run Container
                         ▼
              ┌──────────────────────────┐
              │   DOCKER CONTAINER       │
              │  Name: bypur-portfolio   │
              │  Memory: 512MB           │
              │  CPU: 0.5 core           │
              │  Port: 3000 (internal)   │
              └──────────┬───────────────┘
                         │
                         │ Proxy
                         ▼
              ┌──────────────────────────┐
              │   NGINX REVERSE PROXY    │
              │  Port: 80 (HTTP)         │
              │  Port: 443 (HTTPS)       │
              │  Domain: bypur.my.id     │
              └──────────┬───────────────┘
                         │
                         │ Internet
                         ▼
              ┌──────────────────────────┐
              │         USERS            │
              │  https://bypur.my.id     │
              └──────────────────────────┘
```

### Container Hierarchy

```
VPS (Ubuntu 24.04)
│
├── Jenkins Container (512MB)
│   └── Port 8080
│
├── Application Container (512MB)
│   ├── Next.js App
│   └── Port 3000
│
└── Nginx Container (50MB)
    ├── Port 80 (HTTP)
    └── Port 443 (HTTPS)
```

---

## 🐳 5. Docker Setup Rules

### Memory & CPU Limits (MANDATORY)

⚠️ **NEVER run containers without resource limits on this VPS!**

### Docker Run Command Template

```bash
docker run -d \
  --name bypur-portfolio \
  --memory="512m" \
  --memory-swap="1g" \
  --cpus="0.5" \
  --restart=unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  bypur-portfolio:latest
```

### Docker Compose with Limits

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bypur-portfolio
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    networks:
      - bypur-network
    # RESOURCE LIMITS (REQUIRED)
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M

  nginx:
    image: nginx:alpine
    container_name: bypur-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - bypur-network
    # NGINX LIMITS
    deploy:
      resources:
        limits:
          cpus: '0.2'
          memory: 128M

networks:
  bypur-network:
    driver: bridge
```

### Resource Limit Rules

```
┌────────────────────┬──────────┬──────────────────────────┐
│  Container         │  Memory  │  CPU                     │
├────────────────────┼──────────┼──────────────────────────┤
│  Jenkins           │  512 MB  │  0.5 core                │
│  Application       │  512 MB  │  0.5 core                │
│  Nginx             │  128 MB  │  0.2 core                │
│  Build (temp)      │  768 MB  │  1.0 core (short burst)  │
└────────────────────┴──────────┴──────────────────────────┘

Total Max Usage: 1.5 GB RAM + 1.2 CPU cores
Leaves: ~500MB RAM free for system operations
```

### Container Management Commands

```bash
# Build image
docker build -t bypur-portfolio:latest .

# Run with limits
docker run -d \
  --name bypur-portfolio \
  --memory="512m" \
  --cpus="0.5" \
  --restart=unless-stopped \
  -p 3000:3000 \
  bypur-portfolio:latest

# Stop and remove old container
docker stop bypur-portfolio
docker rm bypur-portfolio

# View resource usage (MONITOR THIS!)
docker stats bypur-portfolio

# View logs
docker logs -f bypur-portfolio

# Check memory inside container
docker exec bypur-portfolio free -h
```

---

## 🤖 6. Jenkins Setup Rules

### Jenkins Memory Configuration

⚠️ **Jenkins MUST run with memory limits!**

#### Edit Jenkins Configuration

```bash
sudo nano /etc/default/jenkins
```

Add these JVM options:

```bash
JENKINS_JAVA_OPTIONS="-Djava.awt.headless=true \
  -Xms256m \
  -Xmx512m \
  -XX:MaxMetaspaceSize=128m \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=100 \
  -Dhudson.model.DirectoryBrowserSupport.CSP="
```

**Explanation:**
- `-Xms256m` = Start with 256MB heap
- `-Xmx512m` = Max 512MB heap (DO NOT EXCEED!)
- `-XX:MaxMetaspaceSize=128m` = Limit class metadata
- `-XX:+UseG1GC` = Use G1 garbage collector (better for low memory)

#### Restart Jenkins

```bash
sudo systemctl restart jenkins
sudo systemctl status jenkins
```

### Jenkins Executor Configuration

**Jenkins → Manage Jenkins → Configure System**

```
┌──────────────────────────────────────────────┐
│  # of executors: 1                           │
│  Labels: linux docker                        │
│  Usage: Use this node as much as possible    │
└──────────────────────────────────────────────┘
```

**Why only 1 executor?**
- Prevents parallel builds consuming all memory
- Each build needs ~500-700MB during build stage
- 2GB RAM cannot handle multiple builds simultaneously

### Required Jenkins Plugins

**Manage Jenkins → Plugins → Available**

```
✅ Git Plugin              - Git integration
✅ Pipeline               - Pipeline DSL
✅ Docker Pipeline        - Docker commands
✅ SSH Agent              - SSH deployment
✅ Credentials Binding    - Secure secrets
✅ Environment Injector   - Environment variables
✅ NodeJS Plugin          - Node.js installer
```

### Jenkins Credentials Setup

**Manage Jenkins → Credentials → Add**

#### 1. GitHub SSH Key
```
Kind: SSH Username with private key
ID: github-ssh-key
Username: git
Private Key: [Your SSH private key]
Passphrase: [If any]
```

#### 2. VPS SSH Key
```
Kind: SSH Username with private key
ID: vps-ssh-key
Username: root (or your user)
Private Key: [VPS SSH private key]
```

### Jenkins Pipeline Configuration

Create new Pipeline job:

**New Item → Pipeline → bypur-web-pipeline**

```groovy
Definition: Pipeline script from SCM
SCM: Git
  Repository URL: git@github.com:bayupaths/bypur-web.git
  Credentials: github-ssh-key
  Branch: */main
Script Path: Jenkinsfile
```

**Build Triggers:**
```
✅ GitHub hook trigger for GITScm polling
```

---

## 🔄 7. CI/CD Pipeline Flow

### Pipeline Stages Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    JENKINS PIPELINE STAGES                       │
├──────┬──────────────────────────────────────────────────────────┤
│  1   │  Checkout          → Clone from GitHub                   │
│  2   │  Setup             → pnpm install --frozen-lockfile       │
│  3   │  Lint              → ESLint validation                    │
│  4   │  Unit Tests        → Jest unit tests                      │
│  5   │  Integration Tests → Integration test suite               │
│  6   │  Build             → next build (production)              │
│  7   │  Docker Build      → docker build -t bypur-portfolio      │
│  8   │  Docker Deploy     → Stop old, run new container          │
│  9   │  Health Check      → Verify deployment success            │
└──────┴──────────────────────────────────────────────────────────┘

Estimated Duration: 8-12 minutes
```

### Detailed Workflow

#### Step 1: Developer Push to GitHub

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

#### Step 2: GitHub Webhook Triggers Jenkins

GitHub sends POST request to:
```
http://jenkins.bypur.my.id:8080/github-webhook/
```

#### Step 3: Jenkins Pulls Repository

```groovy
stage('Checkout') {
  steps {
    checkout scm
  }
}
```

#### Step 4: Install Dependencies

```groovy
stage('Setup') {
  steps {
    sh '''
      npm install -g pnpm@10.32.1
      pnpm install --frozen-lockfile
    '''
  }
}
```

#### Step 5: Run Tests & Lint

```groovy
stage('Lint') {
  steps {
    sh 'pnpm lint'
  }
}

stage('Unit & Integration Tests') {
  steps {
    sh 'pnpm run test:ci:no-e2e'
  }
}
```

#### Step 6: Build Docker Image

```groovy
stage('Docker Build') {
  steps {
    sh '''
      docker build -t bypur-portfolio:latest .
      docker tag bypur-portfolio:latest bypur-portfolio:${BUILD_NUMBER}
    '''
  }
}
```

#### Step 7: Deploy Container

```groovy
stage('Deploy') {
  steps {
    sh '''
      # Stop and remove old container
      docker stop bypur-portfolio || true
      docker rm bypur-portfolio || true
      
      # Run new container with resource limits
      docker run -d \
        --name bypur-portfolio \
        --memory="512m" \
        --cpus="0.5" \
        --restart=unless-stopped \
        -p 3000:3000 \
        -e NODE_ENV=production \
        bypur-portfolio:latest
      
      # Wait for container to start
      sleep 5
      
      # Health check
      curl -f http://localhost:3000 || exit 1
    '''
  }
}
```

### Build Artifact Cleanup

Add this to Jenkinsfile to prevent disk space issues:

```groovy
options {
  buildDiscarder(logRotator(
    numToKeepStr: '5',
    artifactNumToKeepStr: '2'
  ))
}
```

---

## 🔐 8. Environment Variables

### Secure Environment Management

#### Jenkins Credentials (Recommended)

**Manage Jenkins → Credentials → Add Secret Text**

```
ID: NEXT_PUBLIC_API_URL
Secret: https://api.bypur.my.id
```

#### Use in Jenkinsfile

```groovy
environment {
  NEXT_PUBLIC_API_URL = credentials('NEXT_PUBLIC_API_URL')
  NODE_ENV = 'production'
}

stage('Deploy') {
  steps {
    sh '''
      docker run -d \
        --name bypur-portfolio \
        --memory="512m" \
        --cpus="0.5" \
        -e NODE_ENV=${NODE_ENV} \
        -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
        bypur-portfolio:latest
    '''
  }
}
```

### Environment File (.env)

**DO NOT commit .env to Git!**

#### Create .env on VPS

```bash
sudo mkdir -p /opt/bypur-web
cd /opt/bypur-web
sudo nano .env
```

**Example .env:**
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://api.bypur.my.id
NEXT_PUBLIC_USE_BACKEND=false
```

#### Mount .env in Docker

```bash
docker run -d \
  --name bypur-portfolio \
  --memory="512m" \
  --cpus="0.5" \
  --env-file /opt/bypur-web/.env \
  -p 3000:3000 \
  bypur-portfolio:latest
```

### Security Best Practices

```
✅ Store secrets in Jenkins Credentials
✅ Use .env files for non-sensitive config
✅ Never commit .env to Git (add to .gitignore)
✅ Rotate secrets regularly
✅ Use different secrets for dev/staging/prod
❌ Never hardcode secrets in Jenkinsfile
❌ Never log secrets in console output
```

---

## 🌐 9. Nginx Reverse Proxy Setup

### Install and Configure Nginx

#### Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/bypur.my.id
```

**Production Config:**

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name bypur.my.id www.bypur.my.id;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name bypur.my.id www.bypur.my.id;
    
    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/bypur.my.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bypur.my.id/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Logging
    access_log /var/log/nginx/bypur_access.log;
    error_log /var/log/nginx/bypur_error.log;
    
    # Proxy to Next.js application
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files optimization
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }
    
    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
}
```

#### Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/bypur.my.id /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot --nginx -d bypur.my.id -d www.bypur.my.id

# Auto-renewal test
sudo certbot renew --dry-run

# Renewal is automatic via systemd timer
sudo systemctl status certbot.timer
```

### Nginx Performance Tuning (Low RAM)

```bash
sudo nano /etc/nginx/nginx.conf
```

**Optimized Config:**

```nginx
user www-data;
worker_processes 1;  # 1 core = 1 worker
pid /run/nginx.pid;

events {
    worker_connections 512;  # Low memory = fewer connections
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 15;
    types_hash_max_size 2048;
    client_max_body_size 10M;
    
    # Reduce memory usage
    client_body_buffer_size 128k;
    large_client_header_buffers 4 16k;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss;
    
    # Include configs
    include /etc/nginx/mime.types;
    include /etc/nginx/sites-enabled/*;
}
```

---

## 📝 10. Deployment Commands Summary

### Complete Deployment Workflow

#### Initial Setup (One-time)

```bash
# 1. Clone repository
cd /opt
sudo git clone git@github.com:bayupaths/bypur-web.git
cd bypur-web

# 2. Create environment file
sudo nano .env
# Add your environment variables

# 3. Build Docker image
docker build -t bypur-portfolio:latest .

# 4. Run container
docker run -d \
  --name bypur-portfolio \
  --memory="512m" \
  --cpus="0.5" \
  --restart=unless-stopped \
  --env-file .env \
  -p 3000:3000 \
  bypur-portfolio:latest

# 5. Configure Nginx
sudo nano /etc/nginx/sites-available/bypur.my.id
sudo ln -s /etc/nginx/sites-available/bypur.my.id /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 6. Setup SSL
sudo certbot --nginx -d bypur.my.id -d www.bypur.my.id
```

#### Regular Deployment (Jenkins automated)

```bash
# Jenkins handles this automatically on git push:
# 1. Pull latest code
# 2. Run tests
# 3. Build Docker image
# 4. Deploy container
```

#### Manual Deployment (if needed)

```bash
# Pull latest code
cd /opt/bypur-web
git pull origin main

# Build new image
docker build -t bypur-portfolio:latest .

# Stop old container
docker stop bypur-portfolio
docker rm bypur-portfolio

# Run new container
docker run -d \
  --name bypur-portfolio \
  --memory="512m" \
  --cpus="0.5" \
  --restart=unless-stopped \
  --env-file .env \
  -p 3000:3000 \
  bypur-portfolio:latest

# Verify
docker ps
curl -I http://localhost:3000
```

### Service Management Commands

```bash
# Jenkins
sudo systemctl start jenkins
sudo systemctl stop jenkins
sudo systemctl restart jenkins
sudo systemctl status jenkins
journalctl -u jenkins -f

# Docker
sudo systemctl start docker
sudo systemctl stop docker
sudo systemctl restart docker
sudo systemctl status docker

# Nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl reload nginx  # Reload config without downtime
sudo systemctl status nginx
sudo nginx -t  # Test configuration
```

### Container Management

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View logs
docker logs bypur-portfolio
docker logs -f bypur-portfolio  # Follow logs
docker logs --tail 100 bypur-portfolio

# Execute commands in container
docker exec -it bypur-portfolio sh
docker exec bypur-portfolio node --version

# Resource usage
docker stats bypur-portfolio

# Stop container
docker stop bypur-portfolio

# Remove container
docker rm bypur-portfolio

# Remove old images (cleanup)
docker image prune -a

# View images
docker images
```

### Monitoring Commands

```bash
# System resources
htop
free -h
df -h
uptime

# Memory usage
free -m
cat /proc/meminfo | grep MemAvailable

# Disk usage
df -h /
du -sh /var/lib/docker

# Network
netstat -tulpn | grep LISTEN
ss -tulpn

# Logs
tail -f /var/log/nginx/bypur_access.log
tail -f /var/log/nginx/bypur_error.log
journalctl -u jenkins -f
```

---

## ⚠️ 11. Warning Section

### Critical Warnings for Low-Spec VPS

#### ⛔ DO NOT RUN THESE SERVICES

```
❌ SonarQube
   Reason: Requires 2GB+ RAM alone
   Alternative: Use GitHub Actions + SonarCloud

❌ Elasticsearch / Logstash / Kibana (ELK Stack)
   Reason: Each service requires 1GB+ RAM
   Alternative: Use simple log files + grep

❌ Full PostgreSQL / MySQL Servers
   Reason: Heavy memory footprint
   Alternative: Use SQLite or remote database

❌ Redis (unless absolutely needed)
   Reason: Additional memory overhead
   Alternative: In-memory caching in Node.js

❌ Multiple Concurrent Builds
   Reason: Build process needs 500-700MB RAM
   Alternative: Jenkins 1 executor only

❌ Development Environments on Production VPS
   Reason: Double memory usage
   Alternative: Use local development only
```

#### ⚠️ Memory Management Rules

**Always Monitor:**
```bash
# Install htop for real-time monitoring
sudo apt install htop -y
htop

# Check memory every hour
watch -n 3600 free -h

# Set up memory alerts
sudo apt install sysstat -y
```

**What to Watch:**
```
DANGER ZONE:
- Available memory < 200MB = CRITICAL
- Swap usage > 2GB = WARNING
- Docker using > 1.2GB = CHECK LIMITS
```

**When Memory Gets Low:**
```bash
# 1. Check what's using memory
docker stats
ps aux --sort=-%mem | head

# 2. Restart containers (releases memory)
docker restart bypur-portfolio

# 3. Restart Jenkins (if needed)
sudo systemctl restart jenkins

# 4. Clear system cache (safe)
sudo sync; echo 3 | sudo tee /proc/sys/vm/drop_caches

# 5. Remove unused Docker images
docker image prune -a
```

#### 🔥 Emergency Recovery Procedures

**Scenario 1: Out of Memory (OOM) Kill**
```bash
# Check OOM logs
dmesg | grep -i "killed process"
journalctl -xe | grep -i "oom"

# Immediate actions:
1. Increase swap: sudo fallocate -l 4G /swapfile
2. Reduce Docker limits: --memory="256m"
3. Restart Jenkins with lower heap: -Xmx256m
```

**Scenario 2: Disk Space Full**
```bash
# Find large files
sudo du -sh /var/lib/docker/*
sudo du -sh /var/log/*

# Clean up
docker system prune -a --volumes
sudo journalctl --vacuum-time=3d
rm -rf /tmp/*
```

**Scenario 3: Jenkins Won't Start**
```bash
# Check logs
sudo journalctl -u jenkins -n 100

# Common fixes:
sudo systemctl stop jenkins
sudo rm /var/cache/jenkins/war/  # Clear cache
sudo systemctl start jenkins
```

#### 📊 Performance Benchmarks

**Expected Performance:**
```
┌──────────────────────────┬─────────────┬─────────────┐
│  Metric                  │  Normal     │  Danger     │
├──────────────────────────┼─────────────┼─────────────┤
│  Memory Usage (idle)     │  800 MB     │  > 1.7 GB   │
│  Memory Usage (build)    │  1.5 GB     │  > 1.9 GB   │
│  Swap Usage              │  < 500 MB   │  > 3 GB     │
│  CPU Load                │  < 0.7      │  > 0.9      │
│  Disk Usage              │  < 30 GB    │  > 38 GB    │
│  Build Time              │  8-12 min   │  > 20 min   │
└──────────────────────────┴─────────────┴─────────────┘
```

#### 🛡️ Preventive Measures

**Daily Checks:**
```bash
# Create monitoring script
cat > /opt/monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Health Check ==="
echo "Memory:"
free -h
echo ""
echo "Disk:"
df -h /
echo ""
echo "Docker:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.CPUPerc}}\t{{.MemUsage}}"
EOF

chmod +x /opt/monitor.sh

# Add to crontab (run every 6 hours)
(crontab -l 2>/dev/null; echo "0 */6 * * * /opt/monitor.sh >> /var/log/system-health.log") | crontab -
```

**Weekly Cleanup:**
```bash
# Create cleanup script
cat > /opt/cleanup.sh << 'EOF'
#!/bin/bash
echo "=== Weekly Cleanup ==="
docker image prune -a -f
journalctl --vacuum-time=7d
apt autoremove -y
echo "Cleanup completed"
EOF

chmod +x /opt/cleanup.sh

# Add to crontab (run every Sunday 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * 0 /opt/cleanup.sh >> /var/log/cleanup.log") | crontab -
```

---

## 📚 Additional Resources

### Documentation Links

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Resource Constraints](https://docs.docker.com/config/containers/resource_constraints/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Nginx Performance Tuning](https://www.nginx.com/blog/tuning-nginx/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)

### Monitoring Tools

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# System monitor
htop

# I/O monitor
sudo iotop

# Network monitor
sudo nethogs

# Docker monitoring
docker stats --all
```

### Backup Strategy

```bash
# Backup Docker volumes
docker run --rm \
  --volumes-from bypur-portfolio \
  -v $(pwd):/backup \
  alpine tar cvf /backup/backup.tar /app

# Backup database (if any)
docker exec bypur-portfolio pg_dump -U user db > backup.sql

# Automated backups
0 3 * * * /opt/backup.sh >> /var/log/backup.log 2>&1
```

---

## 📞 Support & Troubleshooting

### Common Issues & Solutions

**Issue 1: Container keeps restarting**
```bash
# Check logs
docker logs bypur-portfolio

# Check resource limits
docker inspect bypur-portfolio | grep -A 10 Memory

# Solution: Increase memory or reduce app memory usage
```

**Issue 2: Slow build times**
```bash
# Check disk I/O
iostat -x 1

# Solution: 
# 1. Use Docker layer caching
# 2. Reduce dependencies
# 3. Use .dockerignore
```

**Issue 3: Port already in use**
```bash
# Find process using port 3000
sudo lsof -i :3000
sudo netstat -tulpn | grep 3000

# Kill process
sudo kill -9 <PID>
```

### Health Check Endpoints

```bash
# Application health
curl http://localhost:3000/api/health

# Nginx health
curl -I http://localhost:80

# Jenkins health
curl http://localhost:8080/login
```

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-06-16  
**Author:** Bayu Purnomo  
**Project:** bypur-web Portfolio  
**VPS Spec:** 1 Core | 2GB RAM | 40GB SSD  
**Status:** Production Ready ✅
