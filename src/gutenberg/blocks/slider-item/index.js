/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
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
const { apiVersion, name, category, supports, parent } = metadata;

/**
 * ステップ項目
 */
const blockName = 'ark-block-slider';
registerBlockType(name, {
	apiVersion,
	title: __('Slider content', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,

	edit: () => {
		const blockProps = useBlockProps({
			className: `${blockName}__slide`,
		});

		const innerBlocksProps = useInnerBlocksProps(
			{ className: `${blockName}__txtLayer ark-keep-mt--s` },
			{
				template: [['core/paragraph']],
				templateLock: false,
			}
		);

		return (
			<div {...blockProps}>
				<div className={`${blockName}__imgLayer`}>
					<div {...innerBlocksProps} />
				</div>
			</div>
		);
	},

	save: ({ attributes }) => {
		const {} = attributes;

		const blockProps = useBlockProps.save({
			className: `${blockName}__slide swiper-slide`,
		});

		const pcImg = '';
		const spImg = '';
		const alt = '';
		const imgLayer = pcImg && (
			<picture className={`${blockName}__imgLayer`}>
				{spImg && <source media='(max-width: 959px)' srcSet={spImg} />}
				<img src={pcImg} alt={alt} className={`${blockName}__img`} />
			</picture>
		);
		return (
			<div {...blockProps}>
				{imgLayer}
				<div className={`${blockName}__txtLayer ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
