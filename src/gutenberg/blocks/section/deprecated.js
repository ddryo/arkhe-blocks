/**
 * @WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { SectionSVG } from './components/SectionSVG';
import { BgImage } from './components/BgImageOld';
import { getPositionClassName } from '@helper/getPositionClassName';
import { getBlockStyleOld as getBlockStyle, getColorStyle, getSvgData } from './_helper';

/**
 * @others dependencies
 */
import classnames from 'classnames';
// import hexToRgba from 'hex-to-rgba';

/**
 * metadata
 */
const blockName = 'ark-block-section';
export default [
	{
		supports: {
			anchor: true,
			className: false,
			align: ['wide', 'full'],
		},
		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
			bgColor: {
				type: 'string',
			},
			bgGradient: {
				type: 'string',
			},
			opacity: {
				type: 'number',
				default: 100,
			},
			textColor: {
				type: 'string',
				default: '',
			},
			mediaId: {
				type: 'number',
				default: 0,
			},
			mediaUrl: {
				type: 'string',
				default: '',
			},
			mediaWidth: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="pc"]',
				attribute: 'width',
			},
			mediaHeight: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="pc"]',
				attribute: 'height',
			},
			mediaIdSP: {
				type: 'number',
				default: 0,
			},
			mediaUrlSP: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="sp"]',
				attribute: 'src',
			},
			mediaWidthSP: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="sp"]',
				attribute: 'width',
			},
			mediaHeightSP: {
				type: 'string',
				source: 'attribute',
				selector: '.ark-block-section__bg[data-for="sp"]',
				attribute: 'height',
			},
			mediaType: {
				type: 'string',
				default: '',
			},
			mediaTypeSP: {
				type: 'string',
				default: '',
			},
			focalPoint: {
				type: 'object',
			},
			focalPointSP: {
				type: 'object',
			},
			contentPosition: {
				type: 'string',
			},
			innerSize: {
				type: 'string',
				default: '',
			},
			heightPC: {
				type: 'number',
			},
			heightSP: {
				type: 'number',
			},
			heightUnitPC: {
				type: 'string',
				default: 'px',
			},
			heightUnitSP: {
				type: 'string',
				default: 'px',
			},
			isFullscreen: {
				type: 'boolean',
				default: false,
			},
			padPC: {
				type: 'number',
				default: 4,
			},
			padSP: {
				type: 'number',
				default: 4,
			},
			padUnitPC: {
				type: 'string',
				default: 'rem',
			},
			padUnitSP: {
				type: 'string',
				default: 'rem',
			},
			isRepeat: {
				type: 'boolean',
				default: false,
			},
			svgTypeTop: {
				type: 'string',
				default: 'line',
			},
			svgLevelTop: {
				type: 'number',
				default: 0,
			},
			svgTypeBottom: {
				type: 'string',
				default: 'line',
			},
			svgLevelBottom: {
				type: 'number',
				default: 0,
			},
			svgColorTop: {
				type: 'string',
				default: '',
			},
			svgColorBottom: {
				type: 'string',
				default: '',
			},
		},
		migrate: (attributes) => {
			let height = 'content';
			let heightPC = '400px';
			let heightSP = '50vh';

			if (attributes.heightPC || attributes.heightSP) {
				height = 'custom';
				heightPC = `${attributes.heightPC}${attributes.heightUnitPC}`;
				heightSP = `${attributes.heightSP}${attributes.heightUnitSP}`;
			}

			const _padPC = `${attributes.padPC}${attributes.padUnitPC}`;
			const padPC = { top: _padPC, left: '2rem', right: '2rem', bottom: _padPC };

			const _padSP = `${attributes.padSP}${attributes.padUnitSP}`;
			const padSP = { top: _padSP, left: '4vw', right: '4vw', bottom: _padSP };

			const contentPosition = attributes.contentPosition || 'center left';

			delete attributes.isFullscreen;
			delete attributes.heightUnitPC;
			delete attributes.heightUnitSP;
			delete attributes.padUnitPC;
			delete attributes.padUnitSP;

			return { ...attributes, height, heightPC, heightSP, padPC, padSP, contentPosition };
		},
		save: ({ attributes }) => {
			const {
				mediaUrl,
				innerSize,
				svgLevelTop,
				svgLevelBottom,
				svgTypeTop,
				svgTypeBottom,
				svgColorTop,
				svgColorBottom,
				contentPosition,
				isFullscreen,
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
				'data-fullscreen': isFullscreen ? '1' : null,
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
	},
];
