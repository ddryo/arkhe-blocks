/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	// InspectorControls,
	BlockControls,
	// RichText,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	useMemo,
	//useCallback,
	//useEffect
} from '@wordpress/element';

import { ToolbarButton, ToolbarGroup } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
// import example from './_example';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

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
 * 背景色生成
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
const getBlockStyle = (attributes) => {
	const {
		textColor,
		padPC,
		padSP,
		padUnitPC,
		padUnitSP,
		isRepeat,
		mediaUrl,
		bgColor,
		opacity,
	} = attributes;

	// console.log('Do getBlockStyle');

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	// 背景色
	const _bgColor = getBgColor(bgColor, opacity);
	if (_bgColor) style.backgroundColor = _bgColor;

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

// const getInnerStyle = (svgLevelTop, svgLevelBottom) => {
// 	const innerStyle = {};
// 	if (0 !== svgLevelTop) {
// 		innerStyle.marginTop = `${Math.abs(svgLevelTop)}vw`;
// 	}
// 	if (0 !== svgLevelBottom) {
// 		innerStyle.marginBottom = `${Math.abs(svgLevelBottom)}vw`;
// 	}

// 	return innerStyle;
// };

const getSvgData = (svgLevel) => {
	if (0 === svgLevel) {
		return {
			isReverse: false,
			height: 0,
		};
	}
	// vwに合わせて 100 >> 10.0
	const height = (svgLevel * 0.1).toFixed(1);

	return {
		isReverse: 0 > svgLevel, // 負の値かどうか
		height: Math.abs(height), // 絶対値
	};
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
	// console.log('Do getBgImage');
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

	let pcImgClass = `${blockName}__bg`;
	if (mediaUrlSP) {
		pcImgClass = classnames(pcImgClass, 'u-only-pc');
	}
	if (mediaId) {
		pcImgClass = classnames(pcImgClass, `wp-image-${mediaId}`);
	}

	let spImgClass = `${blockName}__bg u-only-sp`;
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
	title: __('Section', 'arkhe-blocks') + '(β)',
	description: __('Create a content area to use as a section.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon.block,
	},
	category,
	keywords,
	supports,
	// example,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes, isSelected } = props;
		const {
			align,
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
		const style = useMemo(() => getBlockStyle(attributes), [attributes]);

		// 背景画像
		const bgImg = useMemo(() => getBgImage(attributes), [attributes]);

		// svgデータ
		const svgTop = useMemo(() => getSvgData(svgLevelTop), [svgLevelTop]);
		const svgBottom = useMemo(() => getSvgData(svgLevelBottom), [svgLevelBottom]);

		const innerStyle = {
			...(0 !== svgLevelTop ? { marginTop: `${svgTop.height}vw` } : {}),
			...(0 !== svgLevelBottom ? { marginBottom: `${svgBottom.height}vw` } : {}),
		};

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

		const svgSrcTop = useMemo(() => {
			if (svgLevelTop === 0) return null;
			return (
				<SectionSVG
					position='top'
					type={svgTypeTop}
					height={svgTop.height}
					isReverse={svgTop.isReverse}
					fillColor={svgColorTop}
				/>
			);
		}, [svgLevelTop, svgTypeTop, svgColorTop, svgTop]);

		const svgSrcBottom = useMemo(() => {
			if (svgLevelBottom === 0) return null;
			return (
				<SectionSVG
					position='bottom'
					type={svgTypeBottom}
					height={svgBottom.height}
					isReverse={svgBottom.isReverse}
					fillColor={svgColorBottom}
				/>
			);
		}, [svgLevelBottom, svgTypeBottom, svgColorBottom, svgBottom]);

		return (
			<>
				<BlockControls>
					{'full' === align && (
						<ToolbarGroup>
							<ToolbarButton
								className={classnames('components-toolbar__control', {
									'is-pressed': 'full' === innerSize,
								})}
								label={__('To full-width content', 'arkhe-blocks')}
								icon={blockIcon.fullInner}
								onClick={() => {
									if ('full' !== innerSize) {
										setAttributes({ innerSize: 'full' });
									} else {
										setAttributes({ innerSize: '' });
									}
								}}
							/>
						</ToolbarGroup>
					)}

					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<TheSidebar
					attributes={attributes}
					setAttributes={setAttributes}
					isSelected={isSelected}
				/>
				<div {...blockProps}>
					{bgImg}
					{svgSrcTop}
					<div {...innerBlocksProps} />
					{svgSrcBottom}
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			// bgColor,
			// opacity,
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
		const style = getBlockStyle(attributes);

		// 背景画像
		const bgImg = getBgImage(attributes);

		// svgデータ
		const svgTop = getSvgData(svgLevelTop);
		const svgBottom = getSvgData(svgLevelBottom);

		const innerStyle = {
			...(0 !== svgLevelTop ? { marginTop: `${svgTop.height}vw` } : {}),
			...(0 !== svgLevelBottom ? { marginBottom: `${svgBottom.height}vw` } : {}),
		};

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
						type={svgTypeTop}
						height={svgTop.height}
						isReverse={svgTop.isReverse}
						fillColor={svgColorTop}
					/>
				)}
				<div className={`${blockName}__inner ark-keep-mt`} style={innerStyle || null}>
					<InnerBlocks.Content />
				</div>
				{0 !== svgLevelBottom && (
					<SectionSVG
						position='bottom'
						type={svgTypeBottom}
						height={svgBottom.height}
						isReverse={svgBottom.isReverse}
						fillColor={svgColorBottom}
					/>
				)}
			</div>
		);
	},
});
