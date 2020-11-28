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
	const { imgUrl, bgFocalPoint, textColor, padPC, padSP, padUnitPC, padUnitSP } = attributes;

	const style = {};
	if (imgUrl) {
		if (bgFocalPoint) {
			style.backgroundPosition = `${bgFocalPoint.x * 100}% ${bgFocalPoint.y * 100}%`;
		}
	}

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
	// getEditWrapperProps(attributes) {
	// 	const { contentSize } = attributes;
	// 	return { 'data-align': 'full', 'data-content-size': contentSize };
	// },

	edit: (props) => {
		const { attributes } = props;
		const {
			imgUrl,
			topSvgLevel,
			bottomSvgLevel,
			topSvgType,
			bottomSvgType,
			// isFixBg,
			// isParallax,
			// pcPadding,
			// spPadding,
			isReTop,
			isReBottom,
		} = attributes;

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!imgUrl,
			// '-fixbg' : isFixBg,
			// '-parallax' : isParallax,
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
		});
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__inner`,
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
			imgUrl,
			contentSize,
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
			// '-fixbg' : isFixBg,
			// '-parallax' : isParallax,
		});

		// ブロックProps
		const blockProps = useBlockProps.save({
			className: blockClass,
			style: style || null,
		});

		// inner要素のクラス名
		let innerClass = `${blockName}__inner`;
		if ('full' !== contentSize) {
			innerClass = classnames(innerClass, `l-${contentSize}`);
		}

		const bgColor = getBgColor(attributes);

		return (
			<div {...blockProps}>
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

				<div className={innerClass}>
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
