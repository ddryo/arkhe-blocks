#!/bin/bash

#使い方 : $ bash ./bin/zip_pro.sh 2-0-0

#引数 : プラグインのバージョン
version=$1

#上の階層へ
cd ..

#zプラグインファイルをip化
zip -r arkhe-blocks-pro.zip arkhe-blocks-pro -x "*/.*" "*/__*" "*bin*" "*node_modules*" "*vendor*" "*/src/**/*.js" "*phpcs.xml" "*gulpfile.js" "*README.md" "*readme.txt"

#設定ファイル系削除
zip --delete arkhe-blocks-pro.zip  "arkhe-blocks-pro/composer*" "arkhe-blocks-pro/webpack*" "arkhe-blocks-pro/package*"

#zipファイルを移動
mv arkhe-blocks-pro.zip ./_version/arkhe-blocks-pro/arkhe-blocks-pro.zip
cd ./_version/arkhe-blocks-pro

# 一度解答
unzip arkhe-blocks-pro.zip

#IS_PROのセットミスを防止する
sed -i '' -e "s/IS_PRO = false/IS_PRO = true/g" arkhe-blocks-pro/classes/Data.php

#再度zip化
zip -r arkhe-blocks-pro-${version}.zip arkhe-blocks-pro

#不要なファイル削除
rm -rf arkhe-blocks-pro
rm arkhe-blocks-pro.zip
