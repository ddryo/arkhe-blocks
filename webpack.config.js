const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const srcDir = 'src/blocks';

let entries = {}; // ビルドするファイル群
let myEntries = null; // ビルドするファイルを限定したい時に使う
try {
	myEntries = require('./webpack.config.entries');
} catch (err) {}

// entries
if (myEntries) {
	entries = myEntries;
} else {
	entries.fa = './src/blocks/fa.js';
	entries.index = './src/blocks/index.js';

	const blocks = [
		'accordion',
		'accordion-item',
		'box-link',
		'box-links',
		'blog-card',
		'column',
		'columns',
		'dl',
		'dl-dt',
		'dl-dd',
		'dl-div',
		'faq',
		'faq-item',
		'notice',
		'page-list',
		'post-list',
		'rss',
		'section',
		'section-heading',
		'step',
		'step-item',
		'timeline',
		'timeline-item',
	];
	blocks.forEach((key) => {
		entries[key + '/index'] = path.resolve(srcDir, key + '/index.js');
	});
}

/**
 * CleanWebpackPlugin （ビルド先のほかのファイルを勝手に削除するやつ） はオフに。
 */
defaultConfig.plugins.shift();

// ↓ CleanWebpackPlugin が 先頭じゃなくなったとき用
// for (let i = 0; i < defaultConfig.plugins.length; i++) {
// 	const pluginInstance = defaultConfig.plugins[i];
// 	if ('CleanWebpackPlugin' === pluginInstance.constructor.name) {
// 		defaultConfig.plugins.splice(i, i);
// 	}
// }

module.exports = {
	...defaultConfig, //@wordpress/scriptを引き継ぐ

	mode: 'production', // npm start でも圧縮させる

	//エントリーポイント
	entry: entries,

	//アウトプット先
	output: {
		path: path.resolve(__dirname, 'dist/blocks'),
		filename: '[name].js',
	},

	resolve: {
		alias: {
			'@blocks': path.resolve(__dirname, 'src/blocks/'),
			'@components': path.resolve(__dirname, 'src/components/'),
			'@helper': path.resolve(__dirname, 'src/helper/'),
			'@src': path.resolve(__dirname, 'src/'),
		},
	},
};
