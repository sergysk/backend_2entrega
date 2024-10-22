#!/bin/bash

set +x

## Variables
ECR="810372476332.dkr.ecr.us-west-2.amazonaws.com"
FILE=$1

## Remove quotes from image
sed -i '/^\s*image:/ s/"//g' $FILE


LIST_IMG=( $(grep -e "image:" $FILE | awk '{print $2}') )
LIST_DOCKERFILE=( $(grep -e "dockerfile:" $FILE | awk '{print $2}') )



## Function usage with Docker Compose
add_ecr_to_docker_compose() {
    sed -i "s/\(image: \)\(.*\)/\1$ECR\/\2/g" $FILE
    for i in ${LIST_IMG[@]}; do
        
        echo "Remove quotes from image $i"
        i=${i//\"/}

        echo "Checking image $i on ECR"
        exists_img_on_ecr $i
    done
}

## Function usage with Dockerfile
find_dockerfile_on_composer() {
    for d in ${LIST_DOCKERFILE[@]}; do

        echo "Remove quotes from file $d"
        d=${d//\"/}

        echo "File: $d"
        add_ecr_to_dockerfile $d
    done
}


## Function to check if image exists on ECR
exists_img_on_ecr() {
    NAME=$(echo $1 | awk -F: '{print $1}')
    VERSION=$(echo $1 | awk -F: '{print $2}')

    exists_repository_on_ecr $NAME

    # check empty version variable
    if [ -z "$VERSION" ]; then
        if ! aws ecr describe-images --repository-name $NAME --image-ids imageTag=latest --region us-west-2 > /dev/null 2>&1; then
            echo "Version not found and pulling image latest"
        
            echo "Pulling image $NAME"
            docker pull $NAME:latest

            echo "Tagging image $NAME:$VERSION"
            docker tag $NAME $ECR/$NAME:latest

            echo "Login on ECR"
            aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ECR

            echo "Pushing image $NAME:$VERSION"
            docker push $ECR/$NAME:latest
        fi
    else
        if ! aws ecr describe-images --repository-name $NAME --image-ids imageTag=${VERSION} --region us-west-2 > /dev/null 2>&1; then
            echo "Version found: $VERSION"
            echo "Image $NAME:$VERSION not found on ECR"

            echo "Pulling image $NAME:$VERSION"
            docker pull $NAME:$VERSION

            echo "Tagging image $NAME:$VERSION"
            docker tag $NAME:$VERSION $ECR/$NAME:$VERSION

            echo "Login on ECR"
            aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ECR

            echo "Pushing image $NAME:$VERSION"
            docker push $ECR/$NAME:$VERSION
        fi
    fi
    
}

## Function to check if repository exists on ECR
exists_repository_on_ecr() {
    NAME=$1

    if ! aws ecr describe-repositories --repository-names $NAME --region us-west-2 > /dev/null 2>&1; then
        echo "Repository $NAME not found on ECR"
        echo "Creating repository $NAME"
        aws ecr create-repository --repository-name $NAME --region us-west-2
    fi
}

## Function to add ECR to Dockerfile
add_ecr_to_dockerfile() {
    dockerfile=$1

    LIST_FROM=( $(grep -e "FROM" $dockerfile | awk '{print $2}') )
    UNIQ_ITEMS=( $(echo ${LIST_FROM[@]} | tr ' ' '\n' | sort -u) )

    for i in ${UNIQ_ITEMS[@]}; do
        
        echo "Remove quotes from image $i"
        i=${i//\"/}

        echo "Checking image $i on ECR"
        exists_img_on_ecr $i
    done

    echo "Replace ECR in $dockerfile"
    sed -i "s/\(FROM \)\(.*\)/\1$ECR\/\2/g" $dockerfile
}




## Function to start the script
main() {
    if [ ${#LIST_IMG[@]} -gt 0 ]; then
        echo "Adding ECR to Docker Compose"
        add_ecr_to_docker_compose
    fi

    if [ ${#LIST_DOCKERFILE[@]} -gt 0 ]; then
        echo "Adding ECR to Dockerfile"
        find_dockerfile_on_composer
    fi
}



## Starte the script
main