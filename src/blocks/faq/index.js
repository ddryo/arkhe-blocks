/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, __experimentalBlock as Block } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
// import BlockControls from './_controls';
import { iconColor } from '@blocks/config';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-faq';
const { name, category, keywords, supports } = metadata;

/**
 * Q&Aブロック
 */
registerBlockType(name, {
	title: 'Q&A',
	description: __('Create Q & A format content.', 'arkhe-blocks'),
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
		const { attributes, className } = props;
		const blockClass = classnames(className, blockName, 'ark-has-guide');

		return (
			<>
				{/* <BlockControls {...props} /> */}
				<Block.div className={blockClass}>
					<InnerBlocks
						allowedBlocks={['arkhe-blocks/faq-item']}
						templateLock={false}
						template={[['arkhe-blocks/faq-item'], ['arkhe-blocks/faq-item']]}
						__experimentalTagName='div'
						// __experimentalPassedProps={{
						// 	className: 'ark-keep-mt--s',
						// }}
					/>
				</Block.div>
			</>
		);
	},

	save: () => {
		// const blockClass = blockName;
		return (
			<dl className={blockName}>
				<InnerBlocks.Content />
			</dl>
		);
	},
});
