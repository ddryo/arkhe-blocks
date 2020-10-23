/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	// InspectorControls,
	InnerBlocks,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-accordion';
const { name, category, keywords, supports } = metadata;

/**
 * アコーディオン
 */
registerBlockType(name, {
	title: __('Accordion', 'arkhe-blocks'),
	description: __('Create content that can be expanded with a click.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	// providesContext :{
	//     "arkhe-block/accordion/iconOpened": "iconOpened",
	//     "arkhe-block/accordion/iconClosed": "iconClosed"
	// },
	attributes: metadata.attributes,
	example,
	edit: (props) => {
		const { className } = props;
		const blockClass = classnames(className, blockName, 'ark-has-guide');

		return (
			// <>
			<Block.div className={blockClass}>
				<InnerBlocks
					allowedBlocks={['arkhe-blocks/accordion-item']}
					templateLock={false}
					template={[['arkhe-blocks/accordion-item']]}
					__experimentalTagName='div'
				/>
			</Block.div>
			// </>
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
