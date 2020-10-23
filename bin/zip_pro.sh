#!/bin/bashx

#使い方 : $ bash ./bin/zip_free.sh 1-0-0

#引数 : プラグインのバージョン
version=$1

#上の階層へ
cd ..

#zプラグインファイルをip化
zip -r arkhe-blocks.zip arkhe-blocks -x "*/.*" "*/__*" "*bin*" "*node_modules*" "*vendor*" "*/src/blocks/*.js" "*/src/components*" "*phpcs.xml" "*gulpfile.js" "*README.md"

#設定ファイル系削除
zip --delete arkhe-blocks.zip  "arkhe-blocks/composer*" "arkhe-blocks/webpack*" "arkhe-blocks/package*"

#zipファイルを移動
mv arkhe-blocks.zip ./_version/arkhe-blocks/arkhe-blocks.zip
cd ./_version/arkhe-blocks

# 一度解答
unzip arkhe-blocks.zip

#書き換え
sed -i '' -e "s/Arkhe Blocks/Arkhe Blocks Pro/g" arkhe-blocks/arkhe-blocks.php
sed -i '' -e "s/IS_PRO = false/IS_PRO = true/g" arkhe-blocks/arkhe-blocks.php

#名前変更
mv arkhe-blocks/arkhe-blocks.php arkhe-blocks/arkhe-blocks-pro.php
mv arkhe-blocks arkhe-blocks-pro


#再度zip化
zip -r arkhe-blocks-pro-${version}.zip arkhe-blocks-pro

#不要なファイル削除
rm -rf arkhe-blocks-pro
rm arkhe-blocks.zip
