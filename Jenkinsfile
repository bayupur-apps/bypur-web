// Jenkins Pipeline untuk Portfolio - Simple CI/CD
// Build, Test, dan Deploy ke Docker

pipeline {
  agent any

  tools {
    nodejs 'NodeJS-20'  // Configure in Jenkins: Manage Jenkins > Tools > NodeJS
  }

  environment {
    PRODUCTION_SERVER_IP = '${env.PRODUCTION_SERVER_IP}'  // Change to your production server IP
    SONAR_HOST_URL = '${env.SONAR_HOST_URL}'
  }

  stages {
    // 1. Get Source Code
    stage('Checkout') {
      steps {
        checkout scm
        echo 'Source code checked out'
      }
    }

    stage('Prepare Env') {
      steps {
        script {
          withCredentials([string(credentialsId: 'gemini-api-key', variable: 'GEMINI_API_KEY')]) {
            sh '''
              cat > .env.production <<'EOF'
                  NEXT_PUBLIC_API_URL=
                  NEXT_PUBLIC_USE_BACKEND=false
                  NEXT_PUBLIC_CDN_BASE=https://cdn.bypur.my.id
                  GEMINI_API_KEY=${GEMINI_API_KEY}
                  GEMINI_MODEL=gemini-3.1-flash-lite
                  GEMINI_API_REVISION=2026-05-20
                  NODE_ENV=production
                  NEXT_TELEMETRY_DISABLED=1
              EOF
            '''
          }
        }
        echo 'Production env file prepared'
      }
    }

    // 2. Setup Dependencies
    stage('Setup') {
      steps {
        sh '''
          npm install -g pnpm@10.32.1
          pnpm install --frozen-lockfile
        '''
        echo 'Dependencies installed'
      }
    }

    // 3. Code Quality Check
    stage('Lint') {
      steps {
        sh 'pnpm lint'
        echo 'Lint passed'
      }
    }

    // 4. Test Pyramid - Unit & Integration (70% + 20%)
    stage('Unit & Integration Tests') {
      steps {
        sh 'pnpm run test:ci:no-e2e'
        echo 'Unit & Integration tests passed'
      }
    }

    // 5. SonarQube Analysis
    stage('SonarQube Analysis') {
      steps {
        script {
          withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
            sh 'pnpm exec sonar-scanner -Dsonar.token=${SONAR_TOKEN} -Dsonar.host.url=${SONAR_HOST_URL}'
          }
          echo 'SonarQube analysis completed'
        }
      }
    }

    // 6. Quality Gate Check
    stage('Quality Gate') {
      steps {
        script {
          timeout(time: 5, unit: 'MINUTES') {
            // Tunggu hasil quality gate dari SonarQube
            withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
              def qg = sh(
                script: """
                  curl -s -u ${SONAR_TOKEN}: \
                    '${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=bypur-portfolio' \
                    | grep -o '"status":"[^"]*"' | head -n 1 | cut -d'"' -f4
                """,
                returnStdout: true
              ).trim()
              
              echo "Quality Gate Status: ${qg}"
              
              if (qg != 'OK') {
                error "Quality Gate failed! Check SonarQube dashboard: ${SONAR_HOST_URL}/dashboard?id=bypur-portfolio"
              }
              
              echo 'Quality Gate passed'
            }
          }
        }
      }
    }

    // 7. Build Application
    stage('Build') {
      steps {
        sh 'pnpm build'
        echo 'Build completed'
      }
    }

    // 8. Build Docker Image
    stage('Build Docker Image') {
      steps {
        script {
          sh '''
            # Build Docker image
            docker build -t bypur-portfolio:latest .
            echo "Docker image built successfully"
          '''
        }
      }
    }

    // 9. Deploy to Docker Container
    stage('Deploy') {
      steps {
        script {
          withCredentials([string(credentialsId: 'gemini-api-key', variable: 'GEMINI_API_KEY')]) {
            sh '''
              # Stop dan hapus container lama jika ada
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
                -e GEMINI_API_KEY="${GEMINI_API_KEY}" \
                -e GEMINI_MODEL="gemini-3.1-flash-lite" \
                -e GEMINI_API_REVISION="2026-05-20" \
                bypur-portfolio:latest
              
              # Tunggu container start
              sleep 5
              
              # Health check
              curl -f http://localhost:3000 || exit 1
              
              echo "Deployment berhasil! Container running on port 3000"
            '''
          }
        }
      }
    }
  }

  // Post-build Actions
  post {
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed! Check the logs above.'
    }
  }
}
