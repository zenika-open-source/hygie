# abort on errors
set -e

VERSION=$1

cd ../..

echo "> chmod +x"
chmod +x ./node_modules/vuepress/bin/vuepress.js
chmod +x ./node_modules/typedoc/bin/typedoc

echo "> ./node_modules/vuepress/bin/vuepress.js build docs"
./node_modules/vuepress/bin/vuepress.js build docs

echo "> ./node_modules/typedoc/bin/typedoc --out tsdoc src"
./node_modules/typedoc/bin/typedoc src

echo "> mv tsdoc docs/.vuepress/dist"
mv tsdoc docs/.vuepress/dist

echo "> creating .circleci/config.yml file"
mkdir docs/.vuepress/dist/.circleci
cp .circleci/config.yml docs/.vuepress/dist/.circleci/config.yml

echo "> cd docs/.vuepress/dist"
cd docs/.vuepress/dist


git init
git add -A
git commit -m "deploy $VERSION"

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:DX-DeveloperExperience/git-webhooks.git master:gh-pages

cd -
