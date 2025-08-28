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
                  if (branchName == 'admin-qa-ms') {
                     env.IMAGE_TAG = "admin-qa-ms"
                                           }
                  else if (branchName == 'brijesh-devops') {
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
            sh """
             docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} .
             """
          }
     }

   stage('Scan with Trivy') {
      steps {
          sh """
          trivy image --exit-code 1 --severity HIGH,CRITICAL ${DOCKERHUB_REPO}:${IMAGE_TAG} || true
            """
            }
        }



     stage('Push Docker Image') {
       steps {
         script {
           // Push to Docker Hub using the credentials and registry URL
           docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                    docker.image("${DOCKERHUB_REPO}:${IMAGE_TAG}").push()
          }
         // Now remove the image from the local system
         sh "docker image prune -f"
         sh "docker rmi ${DOCKERHUB_REPO}:${IMAGE_TAG} || true"
        }
      }  
     }

     stage('Run Docker Container') {
       steps {
         script {
            def containerName = "admin-qa-panel"
            def imageName = "${DOCKERHUB_REPO}:${IMAGE_TAG}"
          // stop and remove the old container if it's alreday running
           sh """
            docker ps -q --filter name=${containerName} | grep -q . && docker stop ${containerName} || true
            docker ps -a -q --filter name=${containerName} | grep -q . && docker rm ${containerName} || true
              """
            // Pull latest image
            
            sh "docker pull ${imageName}"
            // Run new container on port 6443 (you will reverse-proxy this via Apache)
            sh """
            docker run -d --name ${containerName} -p 6443:443 ${imageName}
               """
     }  
    }
   }        









 }
}
