/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	InspectorControls,
	// BlockControls,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import metadata from './block.json';
import SlideSidebar from './_sidebar';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const { apiVersion, name, category, supports, parent } = metadata;

// https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/columns/variations.js

const getColorStyle = ({ bgColor, bgGradient, opacity }) => {
	const style = {};

	// グラデーションかどうか
	if (bgGradient) {
		style.background = bgGradient;
	} else {
		style.backgroundColor = bgColor || '#f7f7f7';
	}
	style.opacity = (opacity * 0.01).toFixed(2);
	return style;
};

/**
 * スライド
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

	edit: ({ attributes, setAttributes, clientId }) => {
		const {
			bgColor,
			bgGradient,
			opacity,
			textColor,
			alt,
			mediaId,
			mediaUrl,
			mediaWidth,
			mediaHeight,
			mediaIdSP,
			mediaUrlSP,
			mediaWidthSP,
			mediaHeightSP,
			mediaType,
			mediaTypeSP,
			focalPoint,
			focalPointSP,
			contentPosition,
		} = attributes;

		const colorLayerStyle = {
			//backgroundColor: bgColor,
			background: bgGradient || bgColor,
			opacity: (opacity * 0.01).toFixed(2),
		};
		const txtLayerStyle = {
			color: textColor,
		};

		const imgLayer = mediaUrl && (
			<div className={`${blockName}__imgLayer c-filterLayer -filter-dot`}>
				<picture className={`${blockName}__picture`}>
					{mediaUrlSP && <source media='(max-width: 959px)' srcSet={mediaUrlSP} />}
					<img src={mediaUrl} alt={alt} className={`${blockName}__img`} />
				</picture>
			</div>
		);

		const blockProps = useBlockProps({
			className: `${blockName}__slide`,
		});

		const innerBlocksProps = useInnerBlocksProps(
			{ className: `${blockName}__txtLayer ark-keep-mt--s`, style: txtLayerStyle },
			{
				template: [['core/paragraph']],
				templateLock: false,
			}
		);

		return (
			<>
				{/* <BlockControls>
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls> */}
				<InspectorControls>
					<SlideSidebar {...{ attributes, setAttributes, clientId }} />
				</InspectorControls>
				<div {...blockProps}>
					{imgLayer}
					<div className={`${blockName}__colorLayer`} style={colorLayerStyle}></div>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			alt,
			mediaId,
			mediaUrl,
			mediaWidth,
			mediaHeight,
			mediaIdSP,
			mediaUrlSP,
			mediaWidthSP,
			mediaHeightSP,
			mediaType,
			mediaTypeSP,
			focalPoint,
			focalPointSP,
			contentPosition,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `${blockName}__slide swiper-slide`,
		});

		const imgLayer = mediaUrl && (
			<picture className={`${blockName}__imgLayer`}>
				{mediaUrlSP && <source media='(max-width: 959px)' srcSet={mediaUrlSP} />}
				<img src={mediaUrl} alt={alt} className={`${blockName}__img`} />
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
