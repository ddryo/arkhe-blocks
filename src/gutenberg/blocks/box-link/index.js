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
import deprecated from './deprecated';
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';

/**
 * metadata
 */
const { apiVersion, name, category, keywords, supports, parent } = metadata;

/**
 * アコーディオン
 */
registerBlockType(name, {
	apiVersion,
	title: __('Box link', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon.vertical,
	},
	category,
	keywords,
	supports,
	parent,
	example,
	attributes: metadata.attributes,
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'banner', label: __('Banner', 'arkhe-blocks') },
	],
	edit,
	save,
	deprecated,
});
