/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import blockIcon from './_icon';
import example from './_example';
import { iconColor } from '@blocks/config';

/**
 * registerBlockType
 */
registerBlockType(metadata.name, {
	title: __('Box link', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon.vertical,
	},
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
