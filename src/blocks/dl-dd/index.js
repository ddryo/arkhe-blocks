/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
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

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-dl';
const { apiVersion, name, category, supports, parent } = metadata;

/**
 * DD ブロック
 */
registerBlockType(name, {
	apiVersion,
	title: __('Description', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,
	edit: () => {
		const blockProps = useBlockProps({
			className: `${blockName}__dd ark-keep-mt--s`,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			template: [['core/paragraph']],
			templateLock: false,
		});

		return <div {...innerBlocksProps} />;
	},
	save: () => {
		const blockProps = useBlockProps.save({
			className: `${blockName}__dd ark-keep-mt--s`,
		});

		return (
			<dd {...blockProps}>
				<InnerBlocks.Content />
			</dd>
		);
	},
});
