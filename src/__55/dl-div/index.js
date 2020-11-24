/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, __experimentalBlock as Block } from '@wordpress/block-editor';

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
 * DD ブロック
 */
registerBlockType(name, {
	title: __('Side-by-side items', 'arkhe-blocks'), // 横並び項目
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,
	edit: (props) => {
		const { className } = props;
		const blockClass = classnames(className, blockName + '__div');
		return (
			<Block.div className={blockClass}>
				<InnerBlocks
					allowedBlocks={['arkhe-blocks/dl-dt', 'arkhe-blocks/dl-dd']}
					template={[['arkhe-blocks/dl-dt'], ['arkhe-blocks/dl-dd']]}
					templateLock='all'
					__experimentalTagName='div'
				/>
			</Block.div>
		);
	},
	save: () => {
		return (
			<div className={`${blockName}__div`}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
