VERSION=$1
VERSION="${VERSION:1}"

echo "> build"
docker build -t my-webhook:$VERSION ../../.
echo "> login"
docker login -u $DOCKER_USER -p $DOCKER_PASS
echo "> tag"
docker tag my-webhook:$VERSION bastienterrier/git-webhooks:$VERSION # CHANGE LOCATION
echo "> push"
docker push bastienterrier/git-webhooks:$VERSION # CHANGE LOCATION
