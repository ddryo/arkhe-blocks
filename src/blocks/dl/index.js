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
import metadata from './block.json';
import example from './_example';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-dl';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * registerBlockType
 */
registerBlockType(name, {
	apiVersion,
	title: __('Description list', 'arkhe-blocks'),
	description: __('Create a description list using the "dl" tag.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	example,
	// styles: [
	// 	{ name: 'default', label: 'デフォルト', isDefault: true },
	// 	{ name: 'float', label: '横並び' },
	// ],
	attributes: {},
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/dl-div', 'arkhe-blocks/dl-dt', 'arkhe-blocks/dl-dd'],
			template: [
				['arkhe-blocks/dl-dt'],
				['arkhe-blocks/dl-dd'],
				['arkhe-blocks/dl-dt'],
				['arkhe-blocks/dl-dd'],
			],
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		});
		return (
			<>
				<BlockControls>
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
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
			<dl {...blockProps}>
				<InnerBlocks.Content />
			</dl>
		);
	},
});
