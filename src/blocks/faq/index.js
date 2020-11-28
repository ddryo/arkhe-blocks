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
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
import { iconColor } from '@blocks/config';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-faq';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * Q&Aブロック
 */
registerBlockType(name, {
	apiVersion,
	title: 'Q&A',
	description: __('Create Q & A format content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	// styles: [
	// 	{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
	// 	{ name: 'bigq', label: __('Big Q', 'arkhe-blocks') },
	// ],
	example,
	attributes: metadata.attributes,
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/faq-item'],
			template: [['arkhe-blocks/faq-item'], ['arkhe-blocks/faq-item']],
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
			<dl {...blockProps}>
				<InnerBlocks.Content />
			</dl>
		);
	},
});
