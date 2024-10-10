#!/usr/bin/env bash

# This script copies the GitHub Pages site stanford-dancebreak.github.io to dancebreak.stanford.edu.
# It should be placed at /afs/ir/group/dancebreak/cgi-bin
# It can be triggered by a POST request to dancebreak.stanford.edu/cgi-bin/deploy.sh.

echo "Content-Type: text/plain"
echo ""

if [[ "$REQUEST_METHOD" != "POST" ]]
then
  echo "Expected a POST request."
  exit 1
fi

cd ..
DIR=$(mktemp -d)
echo $DIR
wget --mirror --page-requisites https://stanford-dancebreak.github.io -P $DIR
ls $DIR/stanford-dancebreak.github.io
flock -x WWW rsync -avh $DIR/stanford-dancebreak.github.io/ WWW/ --delete
rm -rf $DIR
