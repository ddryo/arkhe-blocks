/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import example from './_example';
import metadata from './block.json';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-timeline';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * タイムラインブロック
 */
registerBlockType(name, {
	apiVersion,
	title: __('Timeline', 'arkhe-blocks'),
	description: __('Create timeline format content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	example,
	attributes: metadata.attributes,
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/timeline-item'],
			template: [['arkhe-blocks/timeline-item'], ['arkhe-blocks/timeline-item']],
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
			className: `${blockName}`,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
