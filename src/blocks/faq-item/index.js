/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InnerBlocks,
	InspectorControls,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
import { iconColor } from '@blocks/config';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-faq';
const { name, category, supports, parent } = metadata;

/**
 * Q&A項目ブロック
 */
registerBlockType(name, {
	title: __('Q&A item', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes, className } = props;
		const blockClass = classnames(className, `${blockName}__item`);

		return (
			<Block.div className={blockClass}>
				<RichText
					className={`${blockName}__q`}
					tagName='div'
					placeholder={__('Enter text', 'arkhe-blocks') + '...'}
					value={attributes.textQ}
					onChange={(textQ) => setAttributes({ textQ })}
				/>
				<div className={`${blockName}__a`}>
					<InnerBlocks
						templateLock={false}
						__experimentalTagName='div'
						__experimentalPassedProps={{
							className: 'ark-keep-mt--s',
						}}
					/>
				</div>
			</Block.div>
		);
	},
	save: (props) => {
		const blockClass = `${blockName}__item`;
		return (
			<div className={blockClass}>
				<RichText.Content
					tagName='dt'
					className={`${blockName}__q`}
					value={props.attributes.textQ}
				/>
				<dd className={`${blockName}__a ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</dd>
			</div>
		);
	},
});
