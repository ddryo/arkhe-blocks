/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InnerBlocks, __experimentalBlock as Block } from '@wordpress/block-editor';
// import { PanelBody, RadioControl } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { ArkheSVG } from '@components/ArkheSVG';
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-accordion';
const { name, category, supports, parent, usesContext } = metadata;

/**
 * アコーディオン項目ブロック
 */
registerBlockType(name, {
	title: __('Accordion item', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	usesContext,
	attributes: metadata.attributes,
	edit: (props) => {
		const { className, attributes, setAttributes } = props;
		// const iconOpened = context['arkhe-block/accordion/iconOpened'];
		// const iconClosed = context['arkhe-block/accordion/iconClosed'];

		const blockClass = classnames(className, `${blockName}__item`);
		return (
			<Block.div className={blockClass} aria-expanded='true'>
				<div className={`${blockName}__title`}>
					<RichText
						tagName='div'
						className={`${blockName}__label`}
						placeholder={__('Enter text', 'arkhe-blocks') + '...'}
						value={attributes.title}
						onChange={(title) => setAttributes({ title })}
					/>
					<span className={`${blockName}__icon`} aria-hidden='false' data-opened='true'>
						<span className='__closed'>
							<ArkheSVG icon='arkb-svg-plus' />
						</span>
						<span className='__opened'>
							<ArkheSVG icon='arkb-svg-minus' />
						</span>
					</span>
				</div>
				<div className={`${blockName}__body`}>
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
	save: ({ attributes }) => {
		const { title } = attributes;
		return (
			<div className={`${blockName}__item`} aria-expanded='false'>
				<div className={`${blockName}__title`} data-ark-acc>
					<span className={`${blockName}__label`}>
						<RichText.Content value={title} />
					</span>
					<span className={`${blockName}__icon`} aria-hidden='true' data-opened='false'>
						<span className='__closed'>
							<ArkheSVG icon='arkb-svg-plus' />
						</span>
						<span className='__opened'>
							<ArkheSVG icon='arkb-svg-minus' />
						</span>
					</span>
				</div>

				<div className={`${blockName}__body ark-keep-mt--s`} aria-hidden='true'>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
