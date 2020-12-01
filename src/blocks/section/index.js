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
import TheSidebar from './_sidebar';
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
 * スタイルをセットする関数
 */
const getBlockStyle = (attributes, bgColor) => {
	const { textColor, padPC, padSP, padUnitPC, padUnitSP, isRepeat, mediaUrl } = attributes;

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
	if (isRepeat && mediaUrl) {
		style.backgroundImage = `url(${mediaUrl})`;
		style.backgroundRepeat = 'repeat';
	}

	return style;
};

const getInnerStyle = (svgLevelTop, svgLevelBottom) => {
	const innerStyle = {};
	if (0 !== svgLevelTop) {
		innerStyle.marginTop = `${Math.abs(svgLevelTop)}vw`;
	}
	if (0 !== svgLevelBottom) {
		innerStyle.marginBottom = `${Math.abs(svgLevelBottom)}vw`;
	}

	return innerStyle;
};

/**
 * 背景画像のソース
 */
const getBgImage = ({
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
	isRepeat,
}) => {
	if (isRepeat) {
		return null;
	}

	if (!mediaUrl) {
		return null;
	}

	const bgStyle = {};
	if (!!focalPoint) {
		const pX = (focalPoint.x * 100).toFixed();
		const pY = (focalPoint.y * 100).toFixed();
		bgStyle.objectPosition = `${pX}% ${pY}%`;
	}

	const bgStyleSP = {};
	if (!!focalPoint) {
		const pX = (focalPointSP.x * 100).toFixed();
		const pY = (focalPointSP.y * 100).toFixed();
		bgStyleSP.objectPosition = `${pX}% ${pY}%`;
	}

	let pcImgClass = `${blockName}__bg u-lb-off`;
	if (mediaUrlSP) {
		pcImgClass = classnames(pcImgClass, 'u-only-pc');
	}
	if (mediaId) {
		pcImgClass = classnames(pcImgClass, `wp-image-${mediaId}`);
	}

	let spImgClass = `${blockName}__bg u-lb-off u-only-sp`;
	if (mediaIdSP) {
		spImgClass = classnames(spImgClass, `wp-image-${mediaIdSP}`);
	}

	const mediaForPC =
		'video' === mediaType ? (
			<video
				// controls=''
				autoPlay
				loop
				playsinline
				muted
				src={mediaUrl}
				className={pcImgClass}
				width={mediaWidth || null}
				height={mediaHeight || null}
				data-for='pc'
				style={bgStyle || null}
			/>
		) : (
			<img
				src={mediaUrl}
				className={pcImgClass}
				alt=''
				width={mediaWidth || null}
				height={mediaHeight || null}
				data-for='pc'
				style={bgStyle}
			/>
		);

	let mediaForSP = null;
	if (mediaUrlSP) {
		mediaForSP =
			'video' === mediaTypeSP ? (
				<video
					// controls=''
					autoPlay
					loop
					playsinline
					muted
					src={mediaUrlSP}
					className={spImgClass}
					width={mediaWidthSP || null}
					height={mediaHeightSP || null}
					data-for='sp'
					style={bgStyleSP || null}
				/>
			) : (
				<img
					src={mediaUrlSP}
					className={spImgClass}
					alt=''
					width={mediaWidthSP || null}
					height={mediaHeightSP || null}
					data-for='sp'
					style={bgStyleSP}
				/>
			);
	}

	return (
		<>
			{mediaForPC}
			{mediaForSP}
		</>
	);
};

/**
 * カスタムブロックの登録
 */
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
		const { attributes, setAttributes } = props;
		const {
			bgColor,
			opacity,
			mediaUrl,
			innerSize,
			svgLevelTop,
			svgLevelBottom,
			svgTypeTop,
			svgTypeBottom,
			svgColorTop,
			svgColorBottom,
		} = attributes;

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!mediaUrl,
		});

		// スタイルデータ
		const _bgColor = getBgColor(bgColor, opacity);
		const style = getBlockStyle(attributes, _bgColor);

		// 背景画像
		const bgImg = getBgImage(attributes);

		// heightレベルを10で割っておく
		const _svgLevelTop = (svgLevelTop * 0.1).toFixed(1);
		const _svgLevelBottom = (svgLevelBottom * 0.1).toFixed(1);

		// インナー部分のstyle
		const innerStyle = getInnerStyle(_svgLevelTop, _svgLevelBottom);

		// ブロックProps
		const blockProps = useBlockProps({
			className: blockClass,
			style: style || null,
			'data-inner': innerSize || null,
		});
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__inner ark-keep-mt`,
				style: innerStyle || null,
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
				<TheSidebar attributes={attributes} setAttributes={setAttributes} />
				<div {...blockProps}>
					{bgImg}
					{0 !== svgLevelTop && (
						<SectionSVG
							position='top'
							heightLevel={_svgLevelTop}
							fillColor={svgColorTop}
							type={svgTypeTop}
						/>
					)}
					<div {...innerBlocksProps} />
					{0 !== svgLevelBottom && (
						<SectionSVG
							position='bottom'
							heightLevel={_svgLevelBottom}
							fillColor={svgColorBottom}
							type={svgTypeBottom}
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
			mediaUrl,
			innerSize,
			svgLevelTop,
			svgLevelBottom,
			svgTypeTop,
			svgTypeBottom,
			svgColorTop,
			svgColorBottom,
		} = attributes;

		// styleデータ
		const _bgColor = getBgColor(bgColor, opacity);
		const style = getBlockStyle(attributes, _bgColor);

		// 背景画像
		const bgImg = getBgImage(attributes);

		// heightレベルを10で割っておく
		const _svgLevelTop = (svgLevelTop * 0.1).toFixed(1);
		const _svgLevelBottom = (svgLevelBottom * 0.1).toFixed(1);

		// インナー部分のstyle
		const innerStyle = getInnerStyle(_svgLevelTop, _svgLevelBottom);

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!mediaUrl,
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
				{0 !== svgLevelTop && (
					<SectionSVG
						position='top'
						heightLevel={_svgLevelTop}
						fillColor={svgColorTop}
						type={svgTypeTop}
					/>
				)}
				<div className={`${blockName}__inner ark-keep-mt`} style={innerStyle || null}>
					<InnerBlocks.Content />
				</div>
				{0 !== svgLevelBottom && (
					<SectionSVG
						position='bottom'
						heightLevel={_svgLevelBottom}
						fillColor={svgColorBottom}
						type={svgTypeBottom}
					/>
				)}
			</div>
		);
	},
});
