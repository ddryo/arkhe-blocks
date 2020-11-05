#!/bin/bashx

#使い方 : $ bash ./bin/zip_free.sh 1-0-1

#引数 : プラグインのバージョン
version=$1
version=${version//-/.}

#上の階層へ
cd ..

#zプラグインファイルをip化
zip -r arkhe-blocks.zip arkhe-blocks-pro -x "*/.*" "*/__*" "*/bin*" "*/node_modules*" "*/vendor*" "*/src/blocks/*.js" "*/src/components*" "*phpcs.xml" "*gulpfile.js" "*README.md"

#設定ファイル系削除
zip --delete arkhe-blocks.zip  "arkhe-blocks-pro/composer*" "arkhe-blocks-pro/webpack*" "arkhe-blocks-pro/package*"

#PROブロック & アップデート系 削除
zip --delete arkhe-blocks.zip  "arkhe-blocks-pro/inc/update*" "arkhe-blocks-pro/*/blocks/notice*" "arkhe-blocks-pro/*/blocks/step*" "arkhe-blocks-pro/*/blocks/timeline*" "arkhe-blocks-pro/*/blocks/post-list*" "arkhe-blocks-pro/*/blocks/rss*"

#zipファイルを移動
mv arkhe-blocks.zip ./arkhe-blocks-free/arkhe-blocks.zip
cd ./arkhe-blocks-free
rm -rf arkhe-blocks

# 一度解答
unzip arkhe-blocks.zip
rm arkhe-blocks.zip

#名前変更
mv arkhe-blocks-pro arkhe-blocks
mv arkhe-blocks/arkhe-blocks-pro.php arkhe-blocks/arkhe-blocks.php
sed -i '' -e "s/Arkhe Blocks Pro/Arkhe Blocks/g" arkhe-blocks/arkhe-blocks.php

#IS_PROのセットミスを防止する
sed -i '' -e "s/IS_PRO = true/IS_PRO = false/g" arkhe-blocks/arkhe-blocks.php

# style.css のバージョン書き換え
sed -i '' -e "s/Version: .*/Version: ${version}/g" arkhe-blocks/arkhe-blocks.php
sed -i '' -e "s/date_i18n( 'mdGis' ) : .*/date_i18n( 'mdGis' ) : '${version}' );/g" arkhe-blocks/arkhe-blocks.php


# readme.txt のバージョン書き換え
sed -i '' -e "s/Stable tag: .*/Stable tag: ${version}/g" arkhe-blocks/readme.txt;

#再度zip化
zip -r arkhe-blocks.zip arkhe-blocks
#rm -rf arkhe-blocks
