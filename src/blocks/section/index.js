/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalBlockAlignmentMatrixToolbar as BlockAlignmentMatrixToolbar,
} from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';

import { ToolbarButton, ToolbarGroup } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';

import TheSidebar from './_sidebar';
import { SectionSVG } from './components/SectionSVG';
import { BgImage } from './components/BgImage';
import { ArkheMarginControl } from '@components/ArkheMarginControl';
import { getPositionClassName } from '@helper/getPositionClassName';

/**
 * @others dependencies
 */
import classnames from 'classnames';
// import hexToRgba from 'hex-to-rgba';

/**
 * metadata
 */
const blockName = 'ark-block-section';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * スタイルをセットする関数
 */
const getBlockStyle = (attributes) => {
	const {
		textColor,
		heightPC,
		heightSP,
		heightUnitPC,
		heightUnitSP,
		padPC,
		padSP,
		padUnitPC,
		padUnitSP,
		isRepeat,
		mediaUrl,
	} = attributes;

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	// 内部minheight
	if (heightPC) {
		style['--arkb-section-minH--pc'] = `${heightPC}${heightUnitPC}`;
	}
	if (heightSP) {
		style['--arkb-section-minH--sp'] = `${heightSP}${heightUnitSP}`;
	}

	// 内部padding用の変数
	const _varPadPC = `${padPC}${padUnitPC}`;
	const _varPadSP = `${padSP}${padUnitSP}`;

	if ('4rem' !== _varPadPC) {
		style['--arkb-section-pad--pc'] = _varPadPC;
	}
	if ('4rem' !== _varPadSP) {
		style['--arkb-section-pad--sp'] = _varPadSP;
	}

	// リピート背景画像
	if (isRepeat && mediaUrl) {
		style.backgroundImage = `url(${mediaUrl})`;
		style.backgroundRepeat = 'repeat';
	}

	return style;
};

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
	example,
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
			contentPosition,
		} = attributes;

		// クラス名
		const positionClass = getPositionClassName(contentPosition, '');
		const blockClass = classnames(blockName, positionClass, {
			'has-bg-img': !!mediaUrl,
			'has-position': !!positionClass,
		});

		// スタイルデータ
		const style = useMemo(() => getBlockStyle(attributes), [attributes]);

		// カラーレイヤーのスタイル
		const colorStyle = useMemo(() => getColorStyle(attributes), [attributes]);

		// 背景画像
		const bgImg = useMemo(() => <BgImage attributes={attributes} />, [attributes]);

		// svgデータ
		const svgTop = useMemo(() => getSvgData(svgLevelTop), [svgLevelTop]);
		const svgBottom = useMemo(() => getSvgData(svgLevelBottom), [svgLevelBottom]);

		// SVG分のpadding
		if (0 !== svgLevelTop) {
			style.paddingTop = `${svgTop.height}vw`;
		}
		if (0 !== svgLevelBottom) {
			style.paddingBottom = `${svgBottom.height}vw`;
		}

		// ブロックProps
		const blockProps = useBlockProps({
			className: blockClass,
			style: style || null,
			'data-inner': innerSize || null,
		});
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__inner ark-keep-mt`,
				// style: innerStyle || null,
			},
			{
				template: [['arkhe-blocks/section-heading'], ['core/paragraph']],
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
					<BlockAlignmentMatrixToolbar
						label={__('Change content position')}
						value={contentPosition || 'null'}
						onChange={(nextPosition) => {
							setAttributes({ contentPosition: nextPosition });
						}}
					/>
					{contentPosition && (
						<ToolbarGroup>
							<ToolbarButton
								className='components-toolbar__control'
								label={__('Delete position', 'arkhe-blocks')}
								icon={blockIcon.removePosition}
								// icon={<Icon icon={cancelCircleFilled} />}
								onClick={() => {
									setAttributes({ contentPosition: undefined });
								}}
							/>
						</ToolbarGroup>
					)}

					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<TheSidebar
						attributes={attributes}
						setAttributes={setAttributes}
						isSelected={isSelected}
					/>
				</InspectorControls>
				<div {...blockProps}>
					{bgImg}
					<div className={`${blockName}__color`} style={colorStyle}></div>
					<div {...innerBlocksProps} />
					{svgSrcTop}
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
			contentPosition,
		} = attributes;

		// styleデータ
		const style = getBlockStyle(attributes);

		// カラーレイヤーのスタイル
		const colorStyle = getColorStyle(attributes);

		// svgデータ
		const svgTop = getSvgData(svgLevelTop);
		const svgBottom = getSvgData(svgLevelBottom);

		// SVG分のpadding
		if (0 !== svgLevelTop) {
			style.paddingTop = `${svgTop.height}vw`;
		}
		if (0 !== svgLevelBottom) {
			style.paddingBottom = `${svgBottom.height}vw`;
		}

		// クラス名
		const positionClass = getPositionClassName(contentPosition, '');
		const blockClass = classnames(blockName, positionClass, {
			'has-bg-img': !!mediaUrl,
			'has-position': !!positionClass,
		});

		// ブロックProps
		const blockProps = useBlockProps.save({
			className: blockClass,
			style: style || null,
			'data-inner': innerSize || null,
		});

		return (
			<div {...blockProps}>
				<BgImage attributes={attributes} />
				<div className={`${blockName}__color`} style={colorStyle}></div>
				<div className={`${blockName}__inner ark-keep-mt`}>
					<InnerBlocks.Content />
				</div>
				{0 !== svgLevelTop && (
					<SectionSVG
						position='top'
						type={svgTypeTop}
						height={svgTop.height}
						isReverse={svgTop.isReverse}
						fillColor={svgColorTop}
					/>
				)}
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
