VERSION=$1
VERSION="${VERSION:1}"

echo "> build"
docker build -t my-webhook:$VERSION ../../.
echo "> login"
docker login -u $DOCKER_USER -p $DOCKER_PASS
echo "> tag"
docker tag my-webhook:$VERSION dxdeveloperexperience/git-webhooks:$VERSION
echo "> push"
docker push dxdeveloperexperience/git-webhooks:$VERSION
