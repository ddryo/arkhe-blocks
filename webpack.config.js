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
	entries.fa = path.resolve(srcDir, 'fa.js');
	entries.index = path.resolve(srcDir, 'index.js');
	entries.ex_core = path.resolve(srcDir, 'ex_core.js');
	entries.format = path.resolve(srcDir, 'format.js');

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
		'tab',
		'tab-body',
		'timeline',
		'timeline-item',
	];
	blocks.forEach((key) => {
		entries['blocks/' + key + '/index'] = path.resolve(srcDir, 'blocks/' + key + '/index.js');
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
		path: path.resolve(__dirname, 'dist/gutenberg'),
		filename: '[name].js',
	},

	resolve: {
		alias: {
			'@blocks': path.resolve(__dirname, 'src/gutenberg/blocks/'),
			'@components': path.resolve(__dirname, 'src/gutenberg/components/'),
			'@helper': path.resolve(__dirname, 'src/gutenberg/helper/'),
			'@src': path.resolve(__dirname, 'src/'),
		},
	},
};
