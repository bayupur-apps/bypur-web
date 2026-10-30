// Jenkins Pipeline untuk bypur-app (Web Frontend)
// Optimized for Low-Resource VPS (1 vCPU / 2 GB RAM)
// Fast Build: Host pnpm build standalone -> Instant lightweight runner Docker packaging

pipeline {
  agent any

  options {
    // Simpan hanya 3 build terakhir untuk menghemat disk VPS
    buildDiscarder(logRotator(numToKeepStr: '3'))
    disableConcurrentBuilds()
    timeout(time: 20, unit: 'MINUTES')
  }

  tools {
    nodejs 'NodeJS-20'
  }

  environment {
    NODE_OPTIONS            = '--max-old-space-size=1024'
    NEXT_TELEMETRY_DISABLED = '1'
  }

  stages {
    // 1. Source Code Checkout
    stage('Checkout') {
      steps {
        checkout scm
        echo 'Source code checked out successfully'
      }
    }

    // 2. Prepare Environment File
    stage('Prepare Env') {
      steps {
        script {
          try {
            withCredentials([file(credentialsId: 'bypur-web-env', variable: 'ENV_SECRET')]) {
              def secretContent = readFile(file: ENV_SECRET)
              writeFile file: '.env', text: secretContent
              writeFile file: '.env.production', text: secretContent
              echo 'Production env file prepared from bypur-web-env credential'
            }
          } catch (Exception e1) {
            try {
              withCredentials([file(credentialsId: 'portfolio-fe-env', variable: 'ENV_SECRET')]) {
                def secretContent = readFile(file: ENV_SECRET)
                writeFile file: '.env', text: secretContent
                writeFile file: '.env.production', text: secretContent
                echo 'Production env file prepared from legacy portfolio-fe-env credential'
              }
            } catch (Exception e2) {
              echo 'bypur-web-env credential not found or skipped, using fallback .env if present'
            }
          }
        }
      }
    }

    // 3. Install Dependencies (Gunakan cache pnpm lokal)
    stage('Setup Dependencies') {
      steps {
        sh '''
          command -v pnpm >/dev/null 2>&1 || npm install -g pnpm@10.32.1
          pnpm install --frozen-lockfile --prefer-offline
        '''
        echo 'Dependencies installed'
      }
    }

    // 4. Code Quality Check (Lint)
    stage('Lint') {
      steps {
        sh 'pnpm lint'
        echo 'Lint checks passed'
      }
    }

    // 5. Unit Tests
    stage('Unit Tests') {
      steps {
        sh 'pnpm run test:ci:no-e2e'
        echo 'Unit tests passed'
      }
    }

    // 6. Build Application (Next.js Standalone Build di Host)
    stage('Build Application') {
      steps {
        sh 'pnpm build'
        echo 'Next.js standalone build completed successfully'
      }
    }

    // 7. Build Docker Image (Instant build: hanya copy artefak standalone ke Alpine Runner)
    stage('Build Docker Image') {
      steps {
        script {
          sh '''
            docker build -t bypur-web:latest .
            echo "Docker image bypur-web:latest built successfully"
          '''
        }
      }
    }

    // 8. Deploy to Docker Container
    stage('Deploy') {
      steps {
        script {
          sh '''
            # Stop dan hapus container lama
            docker stop bypur-web bypur-portfolio 2>/dev/null || true
            docker rm -f bypur-web bypur-portfolio 2>/dev/null || true
            
            # Pastikan docker network bypur_network tersedia
            docker network create bypur_network 2>/dev/null || true
            
            # Jalankan container baru dengan resource limit hemat RAM (512MB)
            if [ -f .env ]; then
              docker run -d \
                --name bypur-web \
                --network bypur_network \
                --memory="512m" \
                --cpus="0.5" \
                --restart=unless-stopped \
                -p 3000:3000 \
                --env-file .env \
                bypur-web:latest
            else
              docker run -d \
                --name bypur-web \
                --network bypur_network \
                --memory="512m" \
                --cpus="0.5" \
                --restart=unless-stopped \
                -p 3000:3000 \
                bypur-web:latest
            fi
            
            # Tunggu dan verifikasi health check
            sleep 5
            curl -f http://localhost:3000 || exit 1
            
            echo "Deployment bypur-web berhasil! Berjalan di port 3000"
          '''
        }
      }
    }
  }

  // Post-build Actions: Notifikasi Telegram terpusat & pembersihan disk
  post {
    success {
      sh 'command -v jenkins-notify >/dev/null 2>&1 && jenkins-notify SUCCESS || true'
    }
    failure {
      sh 'command -v jenkins-notify >/dev/null 2>&1 && jenkins-notify FAILED || true'
    }
    cleanup {
      sh 'docker image prune -f || true'
      deleteDir()
    }
  }
}
