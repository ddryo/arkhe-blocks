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
import example from './_example';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-dl';
const { name, category, keywords, supports } = metadata;

/**
 * registerBlockType
 */
registerBlockType(name, {
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
	edit: (props) => {
		const { className } = props;
		const blockClass = classnames(className, blockName, 'ark-has-guide');

		return (
			<>
				<Block.div className={blockClass}>
					<InnerBlocks
						allowedBlocks={[
							'arkhe-blocks/dl-div',
							'arkhe-blocks/dl-dt',
							'arkhe-blocks/dl-dd',
						]}
						templateLock={false}
						template={[
							['arkhe-blocks/dl-dt'],
							['arkhe-blocks/dl-dd'],
							['arkhe-blocks/dl-dt'],
							['arkhe-blocks/dl-dd'],
						]}
						__experimentalTagName='div'
					/>
				</Block.div>
			</>
		);
	},

	save: () => {
		return (
			<dl className={blockName}>
				<InnerBlocks.Content />
			</dl>
		);
	},
});
