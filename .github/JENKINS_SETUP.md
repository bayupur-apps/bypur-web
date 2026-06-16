# Jenkins CI/CD Setup Guide

Panduan lengkap setup Jenkins untuk CI/CD pipeline project **bypur-web** portfolio.

## 📋 Prerequisites

- Jenkins terinstall di VPS: `jenkins.bypur.my.id`
- Docker & Docker Compose terinstall di VPS
- Git terinstall di VPS
- Domain sudah mengarah ke VPS (bypur.my.id)
- Repository: `bayupaths/bypur-web`

---

## 1️⃣ Install Required Jenkins Plugins

Walaupun Jenkins fresh install, **minimal plugins** berikut **wajib** untuk pipeline ini:

### 1.1 Login ke Jenkins
```
http://jenkins.bypur.my.id:8080
```

### 1.2 Install Plugins (Manage Jenkins → Plugins → Available)

**Core Plugins:**
```
✅ Git Plugin                    - Git integration
✅ Pipeline                      - Pipeline DSL support
✅ Pipeline: Stage View          - Visual pipeline stages
✅ Docker Plugin                 - Docker commands
✅ Docker Pipeline               - Docker agent support
✅ SSH Agent Plugin              - SSH key management
✅ Credentials Binding Plugin    - Secure credentials
✅ Environment Injector          - Environment variables
✅ Timestamper                   - Add timestamps to console output
```

**Optional (Highly Recommended):**
```
✅ Blue Ocean                    - Modern UI
✅ GitHub Plugin                 - GitHub webhook integration
✅ Slack Notification Plugin     - Slack notifications
✅ Email Extension Plugin        - Email notifications
✅ SonarQube Scanner             - Code quality analysis
✅ NodeJS Plugin                 - Node.js environment
```

### 1.3 Restart Jenkins
```bash
# Di VPS
sudo systemctl restart jenkins
```

---

## 2️⃣ Install System Tools di VPS

### 2.1 Install Node.js & pnpm
```bash
# Install Node.js 20 (via nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# Install pnpm
npm install -g pnpm@10.32.1

# Verify
node --version  # Should show v20.x.x
pnpm --version  # Should show 10.32.1
```

### 2.2 Install SonarQube Scanner (Optional)
```bash
# Download SonarScanner
cd /opt
sudo wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
sudo unzip sonar-scanner-cli-5.0.1.3006-linux.zip
sudo mv sonar-scanner-5.0.1.3006-linux sonar-scanner
sudo ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner

# Verify
sonar-scanner --version
```

---

## 3️⃣ Configure Jenkins Credentials

Navigate to: **Manage Jenkins → Credentials → System → Global credentials (unrestricted) → Add Credentials**

### 3.1 GitHub Access Token
```
Kind: Secret text
Scope: Global
Secret: ghp_xxxxxxxxxxxxx (GitHub Personal Access Token)
ID: github-token
Description: GitHub Access Token for bypur-web
```

**Cara Generate GitHub Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Pilih scope: `repo` (full control), `admin:repo_hook` (webhook)
4. Copy token (hanya muncul sekali!)

### 3.2 VPS SSH Key
```
Kind: SSH Username with private key
Scope: Global
ID: vps-ssh-key
Username: root (atau username VPS Anda)
Private Key: Enter directly
  → Paste private key dari ~/.ssh/id_rsa
Passphrase: (jika ada)
Description: VPS SSH Key for Deployment
```

**Generate SSH Key (jika belum punya):**
```bash
# Di VPS
ssh-keygen -t rsa -b 4096 -C "jenkins@bypur.my.id"
cat ~/.ssh/id_rsa       # Copy private key untuk Jenkins
cat ~/.ssh/id_rsa.pub   # Add ke authorized_keys
```

### 3.3 SonarQube Token (Optional)
```
Kind: Secret text
Scope: Global
Secret: squ_xxxxxxxxxxxxx (SonarQube token)
ID: sonarqube-token
Description: SonarQube Authentication Token
```

### 3.4 Docker Hub Credentials (Optional - jika push ke registry)
```
Kind: Username with password
Scope: Global
Username: bayupaths
Password: (Docker Hub password/token)
ID: dockerhub-credentials
Description: Docker Hub Credentials
```

---

## 4️⃣ Configure Global Tools

### 4.1 NodeJS Installation
**Manage Jenkins → Tools → NodeJS installations**

```
Name: Node 20
Install automatically: ✅
Version: NodeJS 20.x
Global npm packages to install: pnpm@10.32.1
```

### 4.2 SonarQube Scanner
**Manage Jenkins → Tools → SonarQube Scanner**

```
Name: SonarScanner
Install automatically: ✅
Version: SonarQube Scanner 5.0.1.3006
```

### 4.3 Git Configuration
**Manage Jenkins → Tools → Git**

```
Name: Default
Path to Git executable: git (or /usr/bin/git)
```

---

## 5️⃣ Configure SonarQube Server (Optional)

### 5.1 Setup SonarQube Server
**Manage Jenkins → System → SonarQube servers**

```
Name: SonarQube
Server URL: http://your-sonarqube-server:9000
Server authentication token: (pilih credential sonarqube-token)
```

**Atau Setup SonarQube di VPS:**
```bash
# Run SonarQube via Docker
docker run -d --name sonarqube \
  -p 9000:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_logs:/opt/sonarqube/logs \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  sonarqube:lts

# Access: http://jenkins.bypur.my.id:9000
# Default login: admin/admin (change password!)
```

---

## 6️⃣ Create Jenkins Pipeline Job

### 6.1 New Item
```
1. Dashboard → New Item
2. Enter name: bypur-web-pipeline
3. Select: Pipeline
4. Click OK
```

### 6.2 Configure Pipeline

**General:**
```
Description: CI/CD Pipeline for Bypur Portfolio Website
✅ GitHub project
Project url: https://github.com/bayupaths/bypur-web
```

**Build Triggers:**
```
✅ GitHub hook trigger for GITScm polling
```

**Pipeline:**
```
Definition: Pipeline script from SCM
SCM: Git
  Repository URL: https://github.com/bayupaths/bypur-web.git
  Credentials: (pilih github-token)
  Branches to build: */main
Script Path: Jenkinsfile
✅ Lightweight checkout
```

**Save**

---

## 7️⃣ Setup GitHub Webhook

### 7.1 Configure Webhook di GitHub Repository

```
1. GitHub → bayupaths/bypur-web → Settings → Webhooks → Add webhook
2. Payload URL: http://jenkins.bypur.my.id:8080/github-webhook/
3. Content type: application/json
4. Secret: (kosongkan atau buat secret)
5. Which events?
   ✅ Just the push event
6. ✅ Active
7. Add webhook
```

### 7.2 Test Webhook
```
Push commit ke repository → Check Jenkins dashboard
Pipeline should trigger automatically!
```

---

## 8️⃣ Configure Environment Variables

### 8.1 Jenkins System Environment
**Manage Jenkins → System → Global properties**

```
✅ Environment variables

Name: DOCKER_IMAGE
Value: bypur-portfolio

Name: DEPLOY_HOST
Value: bypur.my.id

Name: DEPLOY_PATH
Value: /opt/bypur-web
```

### 8.2 Pipeline-Specific Variables (in Jenkinsfile)
Sudah dikonfigurasi di `Jenkinsfile`:
```groovy
environment {
    DOCKER_IMAGE = 'bypur-portfolio'
    DOCKER_TAG = "${env.BUILD_NUMBER}"
    DEPLOY_HOST = 'bypur.my.id'
    DEPLOY_PATH = '/opt/bypur-web'
    SONAR_PROJECT_KEY = 'bypur-portfolio'
}
```

---

## 9️⃣ Prepare VPS Deployment Directory

### 9.1 Create Deployment Directory
```bash
# Di VPS
sudo mkdir -p /opt/bypur-web
sudo chown -R $USER:$USER /opt/bypur-web
cd /opt/bypur-web
```

### 9.2 Create docker-compose.yml for Production
```bash
# File ini akan di-upload oleh Jenkins pipeline
cat > docker-compose.yml <<'EOF'
version: '3.8'

services:
  portfolio:
    image: bypur-portfolio:latest
    container_name: bypur-portfolio
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=
      - NEXT_PUBLIC_USE_BACKEND=false
    networks:
      - bypur-network

networks:
  bypur-network:
    driver: bridge
EOF
```

### 9.3 Setup Nginx Reverse Proxy (Optional)
```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/bypur.my.id
```

**Nginx Config:**
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

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/bypur.my.id /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9.4 Setup SSL (Optional - Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate SSL Certificate
sudo certbot --nginx -d bypur.my.id -d www.bypur.my.id

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔟 Test Pipeline Execution

### 10.1 Manual Trigger
```
1. Jenkins Dashboard → bypur-web-pipeline
2. Click "Build Now"
3. Monitor Blue Ocean view atau Console Output
```

### 10.2 Pipeline Stages (9 stages)
```
Stage 1: Checkout              - Clone repository
Stage 2: Setup                 - Install dependencies (pnpm install)
Stage 3: Lint                  - ESLint code quality
Stage 4: Unit Tests            - Run Jest tests
Stage 5: Integration Tests     - Integration test suites
Stage 6: E2E Tests             - Playwright browser tests
Stage 7: SonarQube Analysis    - Code quality scan
Stage 8: Quality Gate          - SonarQube quality gate check
Stage 9: Build                 - Build Next.js production
Stage 10: Deploy               - Deploy to VPS via Docker
```

### 10.3 Expected Output
```
✅ All stages should pass (green)
✅ Docker container running on VPS
✅ Website accessible at http://bypur.my.id
```

---

## 📊 Monitoring & Logs

### Jenkins Console Output
```
Dashboard → bypur-web-pipeline → Latest build → Console Output
```

### Docker Logs di VPS
```bash
# Check running containers
docker ps

# View logs
docker logs -f bypur-portfolio

# Check resources
docker stats bypur-portfolio
```

### Application Logs
```bash
cd /opt/bypur-web
tail -f logs/app.log
```

---

## 🔧 Troubleshooting

### Issue 1: Pipeline Fails at "Setup" Stage
**Error:** `pnpm: command not found`

**Solution:**
```bash
# Di VPS/Jenkins user
npm install -g pnpm@10.32.1

# Atau di Jenkinsfile, tambahkan:
sh 'npm install -g pnpm@10.32.1'
```

### Issue 2: Docker Build Fails
**Error:** `Cannot connect to Docker daemon`

**Solution:**
```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue 3: E2E Tests Fail
**Error:** `Playwright browsers not found`

**Solution:**
```bash
# Install Playwright dependencies
npx playwright install-deps
npx playwright install
```

### Issue 4: SonarQube Connection Fails
**Error:** `Unable to reach SonarQube server`

**Solution:**
- Check SonarQube server is running
- Verify server URL in Jenkins configuration
- Check firewall rules (port 9000)

### Issue 5: Deployment Fails (SSH)
**Error:** `Permission denied (publickey)`

**Solution:**
```bash
# Ensure SSH key is added to VPS authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Test SSH connection
ssh -i ~/.ssh/id_rsa user@bypur.my.id
```

### Issue 6: Port 3000 Already in Use
**Error:** `bind: address already in use`

**Solution:**
```bash
# Stop existing container
docker stop bypur-portfolio
docker rm bypur-portfolio

# Or find process using port 3000
lsof -i :3000
kill -9 <PID>
```

---

## 🔒 Security Best Practices

1. **Secure Jenkins:**
   ```
   - Enable CSRF Protection
   - Use HTTPS (SSL certificate)
   - Configure user authentication
   - Limit user permissions
   - Regular plugin updates
   ```

2. **Secure Credentials:**
   ```
   - Never commit secrets to Git
   - Use Jenkins Credentials store
   - Rotate tokens regularly
   - Use environment variables
   ```

3. **Secure VPS:**
   ```
   - Configure firewall (ufw/iptables)
   - Disable password authentication (SSH keys only)
   - Keep system updated
   - Monitor logs regularly
   ```

4. **Docker Security:**
   ```
   - Run containers as non-root user
   - Scan images for vulnerabilities
   - Use official base images
   - Limit container resources
   ```

---

## 📈 Performance Optimization

### Caching Dependencies
```groovy
// In Jenkinsfile
options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
}
```

### Parallel Testing
```groovy
stage('Tests') {
    parallel {
        stage('Unit') {
            steps {
                sh 'pnpm test:unit'
            }
        }
        stage('Integration') {
            steps {
                sh 'pnpm test:integration'
            }
        }
    }
}
```

### Docker Layer Caching
```dockerfile
# In Dockerfile - order matters!
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
```

---

## 📞 Notification Setup (Optional)

### Email Notifications
**Jenkinsfile:**
```groovy
post {
    success {
        emailext (
            subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
            body: "Build succeeded!",
            to: "bayu@example.com"
        )
    }
    failure {
        emailext (
            subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
            body: "Build failed! Check console output.",
            to: "bayu@example.com"
        )
    }
}
```

### Slack Notifications
**Jenkinsfile:**
```groovy
post {
    always {
        slackSend (
            color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
            message: "Job: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${currentBuild.result}",
            channel: '#deployments'
        )
    }
}
```

---

## 🚀 Next Steps

1. ✅ **Setup Jenkins** dengan plugins yang diperlukan
2. ✅ **Configure credentials** (GitHub, SSH, SonarQube)
3. ✅ **Create pipeline job** dengan Jenkinsfile dari repo
4. ✅ **Setup GitHub webhook** untuk auto-trigger
5. ✅ **Test pipeline** dengan manual build
6. ✅ **Monitor deployment** di VPS
7. 🔄 **Push to GitHub** → Pipeline triggers automatically!

---

## 📚 Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Official Documentation](https://docs.docker.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**Setup Date:** 2026-06-16  
**Author:** Bayu Purnomo  
**Project:** bypur-web Portfolio  
**Jenkins:** jenkins.bypur.my.id  
**Production:** bypur.my.id
