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
import example from './_example';
import metadata from './block.json';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-timeline';
const { name, category, keywords, supports } = metadata;

/**
 * タイムラインブロック
 */
registerBlockType(name, {
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
	edit: (props) => {
		// const { attributes, setAttributes } = props;

		return (
			<>
				<Block.div className={`${blockName} ark-has-guide`}>
					<InnerBlocks
						allowedBlocks={['arkhe-blocks/timeline-item']}
						templateLock={false}
						template={[['arkhe-blocks/timeline-item'], ['arkhe-blocks/timeline-item']]}
						__experimentalTagName='div'
					/>
				</Block.div>
			</>
		);
	},

	save: () => {
		return (
			<div className={blockName}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
