   env.SUBDIR="src/Website"
   env.SUBNAME="Website.csproj"
   env.NUGGETCONF="/home/ubuntu/.nuget/NuGet/NuGet.Config"
   env.DHOST="www.5spower.com:5000"
   env.DINAME="img_powersales"
   env.DCNAME="powersales"
   env.DCDIR="/home/ubuntu/${BRANCH_NAME}"
   env.OUTDIR="/home/ubuntu/5spbuild/${DCNAME}_${BRANCH_NAME}"

node ('1096227223') {
    try {
        ERRCU ='true'
        echo 'for top try'
        echo ERRCU 
        if ("${BRANCH_NAME}" == 'dev') {    
                echo 'I am dev'
   stage('prepare') { 
	git branch: '${BRANCH_NAME}', credentialsId: '2aeae8a5-9628-43df-bf08-ca675066b3b6', url: 'https://gitlab.5spower.com:8011/GaoEnergyFront/PowerSales.git'        
   }
   stage('update_url') {
	sh "cp /home/ubuntu/${BRANCH_NAME}/environment.prod.ts ${WORKSPACE}/src/environments/"
	sh "cat ${WORKSPACE}/src/environments/environment.prod.ts"		
   }

   stage('compile') {
	sh "cd ${WORKSPACE};npm rebuild"
	sh "npm install"
    sh "npm run build:nodeserver-prod"        
    sh "cd ${WORKSPACE}/dist;npm install"
//	sh "cp /home/ubuntu/.npmrc ${WORKSPACE}"
   }

   stage('docker_build_image') {
	sh "cd ${WORKSPACE};docker build -t ${DHOST}/${DINAME}:${BRANCH_NAME}.1.`date '+%m%d'`.${BUILD_NUMBER} ."
	sh "export DCVER_NPS=1;cd ${DCDIR};docker-compose stop ${DCNAME};docker-compose rm -f ${DCNAME}"
	sh "docker images |grep ${DINAME}"
    }

   stage("run container ${DCNAME}") {
	sh "export DCVER_NPS=${BRANCH_NAME}.1.`date '+%m%d'`.${BUILD_NUMBER};cd ${DCDIR};docker-compose up -d ${DCNAME}"
    sh "docker ps -a|grep ${DINAME}"
    sh "export DCVER_NPS=${BRANCH_NAME}.1.`date '+%m%d'`.${BUILD_NUMBER};cd ${DCDIR};docker-compose logs -t --tail=30 ${DCNAME}"
    }
        }

            else if ("${BRANCH_NAME}" == 'test') {
                echo 'I am test'
   stage('prepare') { 
	git branch: '${BRANCH_NAME}', credentialsId: '2aeae8a5-9628-43df-bf08-ca675066b3b6', url: 'https://gitlab.5spower.com:8011/GaoEnergyFront/PowerSales.git'        
   }
   stage('update_url') {
	sh "cp /home/ubuntu/${BRANCH_NAME}/environment.prod.ts ${WORKSPACE}/src/environments/"
	sh "cat ${WORKSPACE}/src/environments/environment.prod.ts"		
   }

   stage('compile') {
	sh "cd ${WORKSPACE};npm rebuild"
	sh "npm install"
    sh "npm run build:nodeserver-prod"        
    sh "cd ${WORKSPACE}/dist;npm install"
//	sh "cp /home/ubuntu/.npmrc ${WORKSPACE}"
   }

   stage('docker_build_image') {
	sh "cd ${WORKSPACE};docker build -t ${DHOST}/${DINAME}:${BRANCH_NAME}.1.`date '+%m%d'`.${BUILD_NUMBER} ."
	sh "docker images |grep ${DINAME}"
    }

   stage("send DCNAME VER") {
	sh "echo ${BRANCH_NAME}.1.`date \'+%m%d\'`.${BUILD_NUMBER} > /home/ubuntu/DCVER/DCVER_NPS"
	sh "scp -P 22330 /home/ubuntu/DCVER/DCVER_NPS ubuntu@10.10.0.2:/home/ubuntu/DCVER/"
//	sh "scp -P 22330 /home/ubuntu/DCVER/DCVER_NPS ubuntu@10.10.4.2:/home/ubuntu/DCVER/"
	sh "docker push ${DHOST}/${DINAME}:${BRANCH_NAME}.1.`date '+%m%d'`.${BUILD_NUMBER}"
    }
            }

            else if ("${BRANCH_NAME}" == 'master') {
                echo 'I am master'
   stage('prepare') { 
	git branch: '${BRANCH_NAME}', credentialsId: '2aeae8a5-9628-43df-bf08-ca675066b3b6', url: 'https://gitlab.5spower.com:8011/GaoEnergyFront/PowerSales.git'        
   }
   stage('update_url') {
	sh "cp /home/ubuntu/${BRANCH_NAME}/environment.prod.ts ${WORKSPACE}/src/environments/"
	sh "cat ${WORKSPACE}/src/environments/environment.prod.ts"		
   }

   stage('compile') {
	sh "cd ${WORKSPACE};npm rebuild"
	sh "npm install"
    sh "npm run build:nodeserver-prod"        
    sh "cd ${WORKSPACE}/dist;npm install"
//	sh "cp /home/ubuntu/.npmrc ${WORKSPACE}"
   }

   stage('docker_build_image') {
	sh "cd ${WORKSPACE};docker build -t ${DHOST}/${DINAME}:${BRANCH_NAME}.1.`date '+%m%d'`.${BUILD_NUMBER} ."
	sh "docker images |grep ${DINAME}"
    }

   stage("send DCNAME VER") {
	sh "echo ${BRANCH_NAME}.1.`date \'+%m%d\'`.${BUILD_NUMBER} > /home/ubuntu/DCVER/DCVER_NPS"
	//sh "scp -P 22330 /home/ubuntu/DCVER/DCVER_NPS ubuntu@10.10.0.2:/home/ubuntu/DCVER/"
	sh "scp -P 22330 /home/ubuntu/DCVER/DCVER_NPS ubuntu@10.10.4.2:/home/ubuntu/DCVER/"
	sh "docker push ${DHOST}/${DINAME}:${BRANCH_NAME}.1.`date '+%m%d'`.${BUILD_NUMBER}"
    }
            }

            else {
                echo 'unknow branch'
            }
            ERRCU = 'fales' 
            echo 'after all commands'
            echo ERRCU
    }

    catch (exc) {
        echo 'I failed'
        echo 'for catch exc'
        echo ERRCU
    }

    finally {
        echo  'before mail'
        echo ERRCU
        if ( ERRCU == 'true') {
            mail to: 'ge_release@gaoenergy.com',
            subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
            body: """
                Release Project is ${currentBuild.fullDisplayName}
                Release Env is ${BRANCH_NAME}
                Something is wrong with ${env.BUILD_URL}
                """
        }
        else {
            mail to: 'ges_release@gaoenergy.com',
            subject: "Sucessed Pipeline: ${currentBuild.fullDisplayName}",
            body: """       
                Release Project  is ${currentBuild.fullDisplayName}
                Release Env is ${BRANCH_NAME}
                Release Sucessed ${env.BUILD_URL}"""
        }
    }
}
