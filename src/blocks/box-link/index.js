/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import blockIcon from './_icon';

/**
 * metadata
 */
const { name, category, keywords, supports, parent } = metadata;

/**
 * アコーディオン
 */
registerBlockType(name, {
	title: __('Box link', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	parent,
	attributes: metadata.attributes,
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'banner', label: __('Banner', 'arkhe-blocks') },
	],
	edit,
	save,
});
