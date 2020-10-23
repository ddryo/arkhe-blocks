/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	// InnerBlocks,
	__experimentalBlock as Block,
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
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-dl';
const { name, category, supports, parent } = metadata;

/**
 * DT ブロック
 */
registerBlockType(name, {
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
		const { attributes, className, setAttributes } = props;
		const blockClass = classnames(className, blockName + '__dt');
		return (
			<Block.div className={blockClass}>
				<RichText
					tagName='span'
					placeholder={__('Enter text', 'arkhe-blocks') + '...'}
					value={attributes.content}
					onChange={(content) => setAttributes({ content })}
				/>
			</Block.div>
		);
	},
	save: ({ attributes }) => {
		return (
			<dt className={`${blockName}__dt`}>
				<RichText.Content tagName='span' value={attributes.content} />
			</dt>
		);
	},
});
