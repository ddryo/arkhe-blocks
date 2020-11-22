const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

const srcDir = './src/blocks';

const entries = {};
// entries.index = './src/blocks/index.js';

const blocks = [
	// 'accordion',
	// 'accordion-item',
	// 'box-link',
	'box-links',
	'blog-card',
	// 'column',
	// 'columns',
	// 'faq',
	// 'faq-item',
	// 'dl',
	// 'dl-dt',
	// 'dl-dd',
	// 'dl-div',
	// 'notice',
	// 'step',
	// 'step-item',
	// 'timeline',
	// 'timeline-item',
	// 'page-list',
	// 'post-list',
	// 'rss',
	//
	// 'button',
	// 'tab',
];
blocks.forEach((key) => {
	entries[key + '/index'] = path.resolve(srcDir, key + '/index.js');
});

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
