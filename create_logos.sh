#!/usr/bin/env sh

logo=assets/logo.png
output=react-crypto-prices/public
dir=$(dirname $(realpath $0))

convert -resize x16 $dir/$logo $dir/$output/favicon.ico
convert -resize x192 $dir/$logo $dir/$output/logo192.png
convert -resize x512 $dir/$logo $dir/$output/logo512.png
