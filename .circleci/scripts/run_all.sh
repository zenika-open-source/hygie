git config --global user.email "bastien.terrier@gmail.com" > /dev/null 2>&1 # ADD EMAIL TO CIRCLECI ENV VARIABLE
git config --global user.name "bastienterrier" > /dev/null 2>&1 # ADD NAME TO CIRCLECI ENV VARIABLE

VERSION=$((git log --format=oneline -n 1 $CIRCLE_SHA1) | cut -d' ' -f 2-)

echo $VERSION

if [ $VERSION != "npm version" ]
then
  cd .circleci/scripts
  #echo "Calling update_version.sh"
  #./update_version.sh $VERSION

  #echo "Calling add_tag.sh"
  #./add_tag.sh $VERSION

  #echo "Calling docker_push.sh"
  #./docker_push.sh $VERSION

  #echo "Calling npm_registry.sh"
  #./npm_registry.sh

  #echo "Calling deploy-gh-pages"
  #./deploy-gh-pages.sh $VERSION

  #echo "Calling release_notes.sh"
  #./release_notes.sh

fi
