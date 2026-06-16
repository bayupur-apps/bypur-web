// Jenkins Pipeline untuk Portfolio - Simple CI/CD
// Build, Test, dan Deploy ke Docker

pipeline {
  agent any

  tools {
    nodejs 'NodeJS-20'  // Configure in Jenkins: Manage Jenkins > Tools > NodeJS
  }

  environment {
    PRODUCTION_SERVER_IP = '${env.PRODUCTION_SERVER_IP}'  // Change to your production server IP
  }

  stages {
    // 1. Get Source Code
    stage('Checkout') {
      steps {
        checkout scm
        echo '✓ Source code checked out'
      }
    }

    // 2. Setup Dependencies
    stage('Setup') {
      steps {
        sh '''
          npm install -g pnpm@10.32.1
          pnpm install --frozen-lockfile
        '''
        echo '✓ Dependencies installed'
      }
    }

    // 3. Code Quality Check
    stage('Lint') {
      steps {
        sh 'pnpm lint'
        echo '✓ Lint passed'
      }
    }

    // 4. Test Pyramid - Unit & Integration (70% + 20%)
    stage('Unit & Integration Tests') {
      steps {
        sh 'pnpm run test:ci:no-e2e'
        echo '✓ Unit & Integration tests passed'
      }
    }

    // 5. Build Application
    stage('Build') {
      steps {
        sh 'pnpm build'
        echo '✓ Build completed'
      }
    }

    // 6. Build Docker Image
    stage('Build Docker Image') {
      steps {
        script {
          sh '''
            # Build Docker image
            docker build -t bypur-portfolio:latest .
            echo "✓ Docker image built successfully"
          '''
        }
      }
    }

    // 7. Deploy to Docker Container
    stage('Deploy') {
      steps {
        script {
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
              bypur-portfolio:latest
            
            # Tunggu container start
            sleep 5
            
            # Health check
            curl -f http://localhost:3000 || exit 1
            
            echo "✓ Deployment berhasil! Container running on port 3000"
          '''
        }
      }
    }
  }

  // Post-build Actions
  post {
    success {
      echo '✅ Pipeline completed successfully!'
    }
    failure {
      echo '❌ Pipeline failed! Check the logs above.'
    }
  }
}
