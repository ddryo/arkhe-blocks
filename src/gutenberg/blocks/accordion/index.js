/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	// InspectorControls,
	BlockControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import example from './_example';
import blockIcon from './_icon';
import { iconColor } from '@blocks/config';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * style
 */
import './scss/index.scss';

/**
 * アコーディオン
 */
const blockName = 'ark-block-accordion';
registerBlockType(metadata.name, {
	title: __('Accordion', 'arkhe-blocks'),
	description: __('Create content that can be expanded with a click.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	// providesContext :{
	//     "arkhe-block/accordion/iconOpened": "iconOpened",
	//     "arkhe-block/accordion/iconClosed": "iconClosed"
	// },
	attributes: metadata.attributes,
	example,
	edit: ({ attributes, setAttributes }) => {
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
				<BlockControls>
					<ArkheMarginControl attributes={attributes} setAttributes={setAttributes} />
				</BlockControls>
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
