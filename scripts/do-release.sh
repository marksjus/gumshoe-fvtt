#!/usr/bin/env sh

set -eux

v=v$(jq .version src/system.json -r)
git commit -am $v --allow-empty
git push
git tag $v
git push origin $v 