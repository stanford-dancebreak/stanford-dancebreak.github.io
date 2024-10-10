#!/usr/bin/env bash

echo "Content-Type: text/plain"
echo ""

if [[ "$REQUEST_METHOD" != "POST" ]]
then
  echo "Expected a POST request."
  exit 1
fi

cd ..
TOKEN=$(cat access/access-token.txt)
if [[ "$HTTP_X_AUTHORIZE" != "$TOKEN" ]]
then
  echo "Unauthorized."
  exit 1
fi
TAR=$(mktemp)
DIR=$(mktemp -d)
cat > $TAR
tar -xvf $TAR -C $DIR
ls $DIR
rm $TAR
flock -x WWW rsync -avh $DIR/ WWW/ --delete
rm -rf $DIR
