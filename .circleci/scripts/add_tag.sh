TAG=$1
echo "TAG :"
echo $TAG
git tag -a $TAG -m $TAG
git push --tag
