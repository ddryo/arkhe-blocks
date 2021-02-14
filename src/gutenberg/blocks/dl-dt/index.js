/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	// InnerBlocks,
	useBlockProps,
	// __experimentalUseInnerBlocksProps as useInnerBlocksProps,
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
 * DT ブロック
 */
registerBlockType(name, {
	apiVersion,
	title: __('Term', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const blockProps = useBlockProps({
			className: `${blockName}__dt`,
		});

		return (
			<div {...blockProps}>
				<RichText
					tagName='span'
					placeholder={__('Enter text', 'arkhe-blocks') + '...'}
					value={attributes.content}
					onChange={(content) => setAttributes({ content })}
				/>
			</div>
		);
	},
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save({
			className: `${blockName}__dt`,
		});
		return (
			<dt {...blockProps}>
				<RichText.Content tagName='span' value={attributes.content} />
			</dt>
		);
	},
});
