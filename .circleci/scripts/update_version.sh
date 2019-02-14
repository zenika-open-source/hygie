VERSION=$1
VERSION="${VERSION:1}"

echo "VERSION :"
echo $VERSION

npm --no-git-tag-version version $VERSION

git add ../../package.json
git add ../../package-lock.json
git commit -m "update package.json: v$VERSION"
git push
