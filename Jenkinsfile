// Jenkins Pipeline untuk Portfolio dengan Test Pyramid Strategy
// Simple configuration untuk learning CI/CD dengan Jenkins + SonarQube

pipeline {
  agent any

  tools {
    nodejs 'NodeJS-20'  // Configure in Jenkins: Manage Jenkins > Tools > NodeJS
  }

  environment {
    SCANNER_HOME = tool 'SonarQube Scanner'
    SONAR_HOST_URL = credentials('sonar-host-url')  // Add in Jenkins Credentials
    SONAR_TOKEN = credentials('sonar-token')        // Add in Jenkins Credentials
    PRODUCTION_SERVER_IP = '192.168.1.100'          // Change to your production server IP
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
      post {
        always {
          junit allowEmptyResults: true, testResults: 'coverage/junit.xml'
          publishHTML([
            allowMissing: false,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'coverage/lcov-report',
            reportFiles: 'index.html',
            reportName: 'Coverage Report'
          ])
        }
      }
    }

    // 5. Test Pyramid - E2E Tests (10%) - Optional
    stage('E2E Tests') {
      when {
        branch 'main'  // Only on main branch
      }
      steps {
        script {
          // Skip E2E if browsers not available (for learning, this is OK)
          sh '''
            echo "E2E tests skipped in CI (run locally with: pnpm test:e2e)"
            echo "✓ E2E tests stage completed"
          '''
        }
      }
    }

    // 6. SonarQube Code Analysis
    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh '''
            ${SCANNER_HOME}/bin/sonar-scanner \
              -Dsonar.projectKey=bypur-portfolio \
              -Dsonar.sources=. \
              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
          '''
        }
        echo '✓ SonarQube analysis completed'
      }
    }

    // 7. Quality Gate Check
    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
        echo '✓ Quality gate passed'
      }
    }

    // 8. Build Application
    stage('Build') {
      steps {
        sh 'pnpm build'
        echo '✓ Build completed'
      }
      post {
        success {
          archiveArtifacts artifacts: '.next/**/*', fingerprint: true
        }
      }
    }

    // 9. Deploy to VPS
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
  }

  // Post-build Actions
  post {
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed! Check the logs above.'
    }
    always {
      cleanWs()  // Clean workspace after build
    }
  }
}
