cd ../..
echo "> update .npmrc"
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
echo "> npm publish"
npm publish --access public