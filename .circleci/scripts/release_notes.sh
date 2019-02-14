cd ../..
chmod +x ./node_modules/github-release-notes/bin/gren.js
./node_modules/github-release-notes/bin/gren.js release --token=$GREN_TOKEN --override
