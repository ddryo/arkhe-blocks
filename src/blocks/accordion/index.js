/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	// InspectorControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-accordion';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * アコーディオン
 */
registerBlockType(name, {
	apiVersion,
	title: __('Accordion', 'arkhe-blocks'),
	description: __('Create content that can be expanded with a click.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	// providesContext :{
	//     "arkhe-block/accordion/iconOpened": "iconOpened",
	//     "arkhe-block/accordion/iconClosed": "iconClosed"
	// },
	attributes: metadata.attributes,
	example,
	edit: () => {
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/accordion-item'],
			template: [['arkhe-blocks/accordion-item']],
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		});

		return (
			<>
				<div {...innerBlocksProps} />
			</>
		);
	},

	save: () => {
		const blockProps = useBlockProps.save({
			className: blockName,
		});
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
