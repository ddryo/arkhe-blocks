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
	title: __('Description', 'arkhe-blocks'),
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
		const blockClass = classnames(className, blockName + '__dd');
		return (
			<Block.div className={blockClass}>
				<InnerBlocks
					template={[['core/paragraph']]}
					templateLock={false}
					__experimentalTagName='div'
					__experimentalPassedProps={{
						className: 'ark-keep-mt--s',
					}}
				/>
			</Block.div>
		);
	},
	save: () => {
		return (
			<dd className={`${blockName}__dd ark-keep-mt--s`}>
				<InnerBlocks.Content />
			</dd>
		);
	},
});
