pipeline {
  agent any
  tools {nodejs "node"}
   environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub-credentials-id'  // Docker Hub credentials ID
        DOCKERHUB_REPO = "sourcecodelab/sourcecodelab"
	// SONARQUBE_ENV = 'sonarqube'        
    }


  stages {
    stage('Checkout') {
         steps {
           checkout scm 
               }
                      }
    stage('Set Docker Image Tag') {
         steps {
           script {
              // Dynamically assign Docker tag based on branch name
                  def branchName = env.GIT_BRANCH?.replaceFirst(/^origin\//, '') ?: env.BRANCH_NAME
                  echo "Branch: ${branchName}"
                  if (branchName == 'dev') {
                     env.IMAGE_TAG = "dev-admin-latest"
                                           }
                  else if (branchName == 'brij-devops') {
                     env.IMAGE_TAG = "brij-devops-latest"
                                                        }                              
                  else {
                        env.IMAGE_TAG = "${branchName}-latest"  // Default for feature branche
                        }
                  echo "Docker image tag: ${IMAGE_TAG}"     
                    }

                }
           } 

    stage('Build Docker Image') {
       steps {
         script {
            withCredentials([
               string(credentialsId: 'VITE_S3_URL', variable: 'VITE_S3_URL'),
               string(credentialsId: 'VITE_API_URL', variable: 'VITE_API_URL')
                            ]) {
               sh 'docker --version'
               sh 'docker build -t $DOCKERHUB_REPO:$IMAGE_TAG --build-arg VITE_S3_URL=$VITE_S3_URL --build-arg VITE_API_URL=$VITE_API_URL .'                      
                                 }
                     // Build the Docker image with the dynamic tag
		    // docker.build("${DOCKERHUB_REPO}:${IMAGE_TAG}")
                }
             } 
          }

     stage('Push Docker Image') {
       steps {
         script {
           // Push to Docker Hub using the credentials and registry URL
           docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                    docker.image("${DOCKERHUB_REPO}:${IMAGE_TAG}").push()
          }
        }
      }  
     }

        









 }
}
