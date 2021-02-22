/**
 * @WordPress dependencies
 */
import {
	//__,
	_x,
} from '@wordpress/i18n';
import { registerBlockStyle } from '@wordpress/blocks';

// 画像ブロック / 動画ブロック
const coreImageStyles = {
	'ark-media-shadow': _x('Shadow', 'style', 'arkhe-blocks'),
	'ark-media-border': _x('Border', 'style', 'arkhe-blocks'),
	'ark-media-frame': _x('Frame', 'style', 'arkhe-blocks'),
};

for (const key in coreImageStyles) {
	registerBlockStyle('core/image', {
		name: key,
		label: coreImageStyles[key],
	});
	registerBlockStyle('core/video', {
		name: key,
		label: coreImageStyles[key],
	});
}

// リストブロック
const coreListStyles = {
	'ark-list-icon--check': _x('Check', 'style', 'arkhe-blocks'),
	'ark-list-icon--good': _x('Good', 'style', 'arkhe-blocks'),
	'ark-list-icon--bad': _x('Bad', 'style', 'arkhe-blocks'),
	'ark-list-numbered': _x('Numbered', 'style', 'arkhe-blocks'),
	'ark-list-note': _x('Notes', 'style', 'arkhe-blocks'),
};
for (const key in coreListStyles) {
	registerBlockStyle('core/list', {
		name: key,
		label: coreListStyles[key],
	});
}

// メディアと文章
const mediaTextStyles = {
	'ark-card': _x('Card type', 'style', 'arkhe-blocks'),
	'ark-broken': _x('Broken Grid', 'style', 'arkhe-blocks'),
};
for (const key in mediaTextStyles) {
	registerBlockStyle('core/media-text', {
		name: key,
		label: mediaTextStyles[key],
	});
}
