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
const getBgColor = (bgColor, opacity) => {
	if (0 === opacity) {
		// backgroundColorなし
		return '';
	} else if (100 === opacity) {
		return bgColor;
	}
	return hexToRgba(bgColor, opacity / 100);
};

/**
 * 背景画像のソース
 */
const getBgImage = (imgId, imgUrl, imgW, imgH, bgFocalPoint, isRepeat) => {
	if (!imgUrl || isRepeat) {
		return null;
	}

	const bgStyle = bgFocalPoint
		? { objectPosition: `${bgFocalPoint.x * 100}% ${bgFocalPoint.y * 100}%` }
		: null;

	return (
		<img
			src={imgUrl}
			className={`arkb-section__bg -no-lb wp-image-${imgId}`}
			alt=''
			width={imgW || null}
			height={imgH || null}
			style={bgStyle}
		/>
	);
};

/**
 * スタイルをセットする関数
 */
const getBlockStyle = (attributes, bgColor) => {
	const { textColor, padPC, padSP, padUnitPC, padUnitSP, isRepeat, imgUrl } = attributes;

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	// 背景色
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

	// リピート背景画像
	if (isRepeat && imgUrl) {
		style.backgroundImage = `url(${imgUrl})`;
		style.backgroundRepeat = 'repeat';
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
			bgColor,
			opacity,
			imgId,
			imgUrl,
			imgW,
			imgH,
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
			isRepeat,
		} = attributes;

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!imgUrl,
		});

		// スタイルデータ
		const _bgColor = getBgColor(bgColor, opacity);
		const style = getBlockStyle(attributes, _bgColor);

		// 背景画像
		const bgImg = getBgImage(imgId, imgUrl, imgW, imgH, bgFocalPoint, isRepeat);

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
							fillColor={_bgColor}
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
							fillColor={_bgColor}
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
			bgColor,
			opacity,
			imgId,
			imgUrl,
			imgW,
			imgH,
			bgFocalPoint,
			innerSize,
			topSvgLevel,
			bottomSvgLevel,
			topSvgType,
			bottomSvgType,
			isReTop,
			isReBottom,
			isRepeat,
		} = attributes;

		// styleデータ
		const _bgColor = getBgColor(bgColor, opacity);
		const style = getBlockStyle(attributes, _bgColor);

		// 背景画像
		const bgImg = getBgImage(imgId, imgUrl, imgW, imgH, bgFocalPoint, isRepeat);

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

		return (
			<div {...blockProps}>
				{bgImg}
				{0 !== topSvgLevel && !imgUrl && (
					<SectionSVG
						position='top'
						heightLevel={topSvgLevel}
						fillColor={_bgColor}
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
						fillColor={_bgColor}
						type={bottomSvgType}
						isRe={isReBottom}
						isEdit={false}
					/>
				)}
			</div>
		);
	},
});
