/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	// BlockControls,
	// RichText,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
// import { useCallback } from '@wordpress/element';
// import { PanelBody, ButtonGroup, Button } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
// import blockIcon from './_icon';
// import example from './_example';
// import { ArkheMarginControl } from '@components/ArkheMarginControl';

import { SectionSVG } from './_svg';
import FullWidePanels from './_panels';
// import FullWideToolbars from './_toolbars';

/**
 * @others dependencies
 */
import classnames from 'classnames';
import hexToRgba from 'hex-to-rgba';

/**
 * metadata
 */
const blockName = 'ark-block-section';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * 背景色
 */
const getBgColor = (attributes) => {
	const { bgColor, opacity } = attributes;
	if (0 === opacity) {
		// backgroundColorなし
		return '';
	} else if (100 === opacity) {
		return bgColor;
	}
	return hexToRgba(bgColor, opacity / 100);
};

/**
 * スタイルをセットする関数
 */
const getBlockStyle = (attributes) => {
	const { textColor, padPC, padSP, padUnitPC, padUnitSP } = attributes;

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	const bgColor = getBgColor(attributes);
	if (bgColor) style.backgroundColor = bgColor;

	// padding
	const paddingPC = `${padPC}${padUnitPC}`;
	const paddingSP = `${padSP}${padUnitSP}`;

	if ('4rem' !== paddingPC) {
		style['--arkb-section-pad--pc'] = paddingPC;
	}
	if ('4rem' !== paddingSP) {
		style['--arkb-section-pad--sp'] = paddingSP;
	}

	return style;
};

// カスタムブロックの登録
registerBlockType(name, {
	apiVersion,
	title: __('Section', 'arkhe-blocks'),
	description: __('Create a content area to use as a section.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: 'align-wide',
	},
	category,
	keywords,
	supports,
	// example,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes } = props;
		const {
			imgId,
			imgUrl,
			bgFocalPoint,
			topSvgLevel,
			bottomSvgLevel,
			topSvgType,
			bottomSvgType,
			innerSize,
			// pcPadding,
			// spPadding,
			isReTop,
			isReBottom,
		} = attributes;

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!imgUrl,
		});

		// スタイルデータ
		const style = getBlockStyle(attributes);
		// if (imgUrl) {
		// 	style.backgroundImage = 'url(' + imgUrl + ')';
		// }

		const bgColor = getBgColor(attributes);

		// ブロックProps
		const blockProps = useBlockProps({
			className: blockClass,
			style: style || null,
			'data-inner': innerSize || null,
		});
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__inner ark-keep-mt`,
			},
			{
				template: [['core/heading']], // arkhe-blocks/section-heading にする
				templateLock: false,
				// renderAppender: InnerBlocks.ButtonBlockAppender,
			}
		);

		let bgImg = null;
		if (imgUrl) {
			const bgStyle = bgFocalPoint
				? { objectPosition: `${bgFocalPoint.x * 100}% ${bgFocalPoint.y * 100}%` }
				: null;

			bgImg = (
				<img
					src={imgUrl}
					className={`arkb-section__bg -no-lb wp-image-${imgId}`}
					alt=''
					style={bgStyle}
				/>
			);
		}

		return (
			<>
				{/* <BlockControls>
					<FullWideToolbars {...props} />
				</BlockControls> */}
				<InspectorControls>
					<FullWidePanels {...props} />
				</InspectorControls>
				<div {...blockProps}>
					{bgImg}
					{0 !== topSvgLevel && !imgUrl && (
						<SectionSVG
							position='top'
							heightLevel={topSvgLevel}
							fillColor={bgColor}
							type={topSvgType}
							isRe={isReTop}
							isEdit={true}
						/>
					)}
					<div {...innerBlocksProps} />
					{0 !== bottomSvgLevel && !imgUrl && (
						<SectionSVG
							position='bottom'
							heightLevel={bottomSvgLevel}
							fillColor={bgColor}
							type={bottomSvgType}
							isRe={isReBottom}
							isEdit={true}
						/>
					)}
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			imgId,
			imgUrl,
			bgFocalPoint,
			innerSize,
			topSvgLevel,
			bottomSvgLevel,
			topSvgType,
			bottomSvgType,
			isReTop,
			isReBottom,
		} = attributes;

		// styleデータ
		const style = getBlockStyle(attributes);

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!imgUrl,
		});

		// ブロックProps
		const blockProps = useBlockProps.save({
			className: blockClass,
			style: style || null,
			'data-inner': innerSize || null,
		});

		const bgColor = getBgColor(attributes);

		let bgImg = null;
		if (imgUrl) {
			const bgStyle = bgFocalPoint
				? { objectPosition: `${bgFocalPoint.x * 100}% ${bgFocalPoint.y * 100}%` }
				: null;
			bgImg = (
				<img
					src={imgUrl}
					className={`arkb-section__bg -no-lb wp-image-${imgId}`}
					alt=''
					style={bgStyle}
				/>
			);
		}

		return (
			<div {...blockProps}>
				{bgImg}
				{0 !== topSvgLevel && !imgUrl && (
					<SectionSVG
						position='top'
						heightLevel={topSvgLevel}
						fillColor={bgColor}
						type={topSvgType}
						isRe={isReTop}
						isEdit={false}
					/>
				)}
				<div className={`${blockName}__inner ark-keep-mt`}>
					<InnerBlocks.Content />
				</div>
				{0 !== bottomSvgLevel && !imgUrl && (
					<SectionSVG
						position='bottom'
						heightLevel={bottomSvgLevel}
						fillColor={bgColor}
						type={bottomSvgType}
						isRe={isReBottom}
						isEdit={false}
					/>
				)}
			</div>
		);
	},
});
