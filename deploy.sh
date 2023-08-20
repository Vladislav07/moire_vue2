#!/usr/bin/env sh

set -env
npm run build
cd dist

git init
git add .
git commit -m 'deploy_auto'

git push -f https://github.com/Vladislav07/appstore.git master:gh-pages

cd -