#!/bin/bash

echo "Switching to branch bablu/development"
git checkout bablu/development

echo "Cleaning Pevious Build.."
rm -r build

echo "Building app..."
npm run build

echo "Coping .env file to build.."
cp .env ./build

echo "Deploying files to server..."
scp -i newscard.pem -r build/* ubuntu@100.26.226.105:/home/ubuntu/newscard-fe/

echo "Done!"
