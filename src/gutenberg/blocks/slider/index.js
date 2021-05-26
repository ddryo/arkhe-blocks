/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import { blockIcon } from './_icon';
import variations from './_variations';
import Placeholder from './_placeholder';
import SliderEdit from './edit';
import { iconColor } from '@blocks/config';

/**
 * registerBlockType
 */
const { apiVersion, name, category, keywords, supports } = metadata;
registerBlockType(name, {
	apiVersion,
	title: __('Slider', 'arkhe-blocks') + '(β)',
	description: __('Create slider content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	variations,
	// example,
	attributes: metadata.attributes,

	edit: (props) => {
		const { attributes, setAttributes, clientId, isSelected } = props;

		// const blockInformation = useBlockDisplayInformation(clientId);
		// console.log('blockInformation', blockInformation);

		if (!attributes.variation) {
			return <Placeholder {...{ name, setAttributes }} />;
		}
		return <SliderEdit {...{ attributes, setAttributes, clientId, isSelected }} />;
	},

	save: () => {
		return <InnerBlocks.Content />;
	},
});
