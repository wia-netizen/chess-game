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
        stage('Docker') {
            agent any
            when {
                branch 'main'
            }
            environment {
                CI_REGISTRY = 'ghcr.io'
                CI_REGISTRY_USER = 'wia-netizen'
                CI_REGISTRY_IMAGE = "${CI_REGISTRY}/${CI_REGISTRY_USER}/chess"
                CI_REGISTRY_PASSWORD = credentials('CI_REGISTRY_PASSWORD')
            }
            steps {
                sh 'docker build --network=host -t $CI_REGISTRY_IMAGE .'
                sh 'docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY'
                sh 'docker push $CI_REGISTRY_IMAGE'
            }
        }
    }
}