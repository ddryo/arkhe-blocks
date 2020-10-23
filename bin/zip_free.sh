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

#PROブロック & アップデート系 削除
zip --delete arkhe-blocks.zip  "arkhe-blocks/inc/update*" "arkhe-blocks/*/blocks/notice*"

#zipファイルを移動
mv arkhe-blocks.zip ./arkhe-blocks-free/arkhe-blocks.zip
cd ./arkhe-blocks-free
rm -rf arkhe-blocks

# 一度解答
unzip arkhe-blocks.zip
rm arkhe-blocks.zip

#IS_PROのセットミスを防止する
sed -i '' -e "s/IS_PRO = true/IS_PRO = false/g" arkhe-blocks/arkhe-blocks.php


#再度zip化
#zip -r arkhe-blocks-${version}.zip arkhe-blocks
#rm -rf arkhe-blocks
