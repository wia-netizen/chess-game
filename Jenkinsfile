pipeline {
    agent none
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.0-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Unit Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.0-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm run test'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'html',
                        reportFiles: 'index.html',
                        reportName: 'VitestReport',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }
        stage('E2E Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.0-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm run test:e2e'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'PlaywrightReport',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }
        stage('Deploy') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.0-noble'
                    args '--network=host'
                }
            }
            when {
                branch 'main'
            }
            environment {
                NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
            }
            steps {
                sh 'npm run build'
                sh 'node node_modules/netlify-cli/bin/run.js deploy --prod --site chess-game-vvccss'
            }
        }
    }
}