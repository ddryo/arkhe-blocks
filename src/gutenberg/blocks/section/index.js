/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo, useCallback, RawHTML } from '@wordpress/element';
import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalBlockAlignmentMatrixToolbar,
	__experimentalBlockAlignmentMatrixControl,
} from '@wordpress/block-editor';

import { ToolbarButton } from '@wordpress/components';
// import { Icon, fullscreen } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import deprecated from './deprecated';
import blockIcon from './_icon';
import example from './_example';
import TheSidebar from './_sidebar';
import { iconColor } from '@blocks/config';
import { SectionSVG } from './components/SectionSVG';
import { BgMedia } from './components/BgMedia';
import { ArkheMarginControl } from '@components/ArkheMarginControl';
import { getBlockStyle, getColorStyle, getSvgData } from './_helper';

/**
 * @others dependencies
 */
import classnames from 'classnames';
// import hexToRgba from 'hex-to-rgba';

/**
 * registerBlockType
 */
const blockName = 'ark-block-section';
registerBlockType(metadata.name, {
	title: __('Section', 'arkhe-blocks'),
	description: __('Create a content area to use as a section.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon.block,
	},
	example,
	attributes: metadata.attributes,
	edit: ({ attributes, setAttributes, isSelected, clientId }) => {
		const {
			align,
			media,
			innerSize,
			height,
			svgTop,
			svgBottom,
			contentPosition,
			filter,
		} = attributes;

		const { updateBlockAttributes } = useDispatch('core/block-editor');
		const getChildBlocks = useSelect((select) => select('core/block-editor').getBlocks, []);

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!media.url,
		});

		// スタイルデータ
		const style = useMemo(() => getBlockStyle(attributes), [attributes]);

		// カラーレイヤーのスタイル
		const colorStyle = useMemo(() => getColorStyle(attributes), [attributes]);

		// 背景画像
		const bgMedia = useMemo(() => <BgMedia attributes={attributes} />, [attributes]);

		// svgデータ
		const svgDataTop = useMemo(() => getSvgData(svgTop), [svgTop]);
		const svgDataBottom = useMemo(() => getSvgData(svgBottom), [svgBottom]);

		// SVG分のpadding
		if (0 !== svgDataTop.height) {
			style['--arkb-svg-height--top'] = `${svgDataTop.height}vw`;
		}
		if (0 !== svgDataBottom.height) {
			style['--arkb-svg-height--bottom'] = `${svgDataBottom.height}vw`;
		}

		// ブロックProps
		const blockProps = useBlockProps({
			className: blockClass,
			style: style || null,
			'data-height': height || null,
			'data-inner': innerSize || null,
		});

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__bodyInner ark-keep-mt`,
			},
			{
				template: [['arkhe-blocks/section-heading'], ['core/paragraph']],
				templateLock: false,
			}
		);

		// コンテンツ位置変更処理
		const setPosition = useCallback(
			(nextPosition) => {
				// まだ切り替えてなくてもボタン展開する時に実行されてしまうのでそれを防ぐ
				if (contentPosition === nextPosition) {
					return;
				}
				setAttributes({ contentPosition: nextPosition });

				let textAlign = '';
				if (-1 !== nextPosition.indexOf(' center')) {
					textAlign = 'center';
					// setAttributes({ paddingPC: { ...paddingPC, left: '0px', right: '0px' } });
				} else if (-1 !== nextPosition.indexOf(' right')) {
					textAlign = 'right';
					// setAttributes({ paddingPC: { ...paddingPC, left: '50%', right: '0px' } });
				} else if (-1 !== nextPosition.indexOf(' left')) {
					textAlign = 'left';
					// setAttributes({ paddingPC: { ...paddingPC, left: '0px', right: '50%' } });
				}

				// 子ブロックにも反映
				const childBlocks = getChildBlocks(clientId);
				childBlocks.forEach((block) => {
					if ('arkhe-blocks/section-heading' === block.name && textAlign) {
						updateBlockAttributes(block.clientId, { textAlign });
					}
				});
			},
			[contentPosition]
		);

		const BlockAlignmentMatrixControl =
			__experimentalBlockAlignmentMatrixControl || __experimentalBlockAlignmentMatrixToolbar;

		return (
			<>
				<BlockControls group='block'>
					{'full' === align && (
						<>
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
							<BlockAlignmentMatrixControl
								label={__('Change content position')}
								value={contentPosition}
								onChange={setPosition}
							/>
						</>
					)}
				</BlockControls>
				<BlockControls>
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
					{bgMedia}
					<div className={`${blockName}__color arkb-absLayer`} style={colorStyle}></div>
					{'off' !== filter && (
						<div className={`c-filterLayer -filter-${filter} arkb-absLayer`}></div>
					)}
					<div
						className={`${blockName}__body`}
						data-content={contentPosition.replace(' ', '-')}
					>
						<div {...innerBlocksProps} />
					</div>
					<SectionSVG position='top' svgData={svgDataTop} />
					<SectionSVG position='bottom' svgData={svgDataBottom} />
				</div>
			</>
		);
	},
	// save: deprecated[0].save,
	save: ({ attributes }) => {
		const {
			media,
			innerSize,
			height,
			svgTop,
			svgBottom,
			contentPosition,
			filter,
			isRepeat,
		} = attributes;

		// styleデータ
		const style = getBlockStyle(attributes);

		// svgデータ
		const svgDataTop = getSvgData(svgTop);
		const svgDataBottom = getSvgData(svgBottom);

		// SVG分のpadding
		if (0 !== svgDataTop.height) {
			style['--arkb-svg-height--top'] = `${svgDataTop.height}vw`;
		}
		if (0 !== svgDataBottom.height) {
			style['--arkb-svg-height--bottom'] = `${svgDataBottom.height}vw`;
		}

		// カラーレイヤーのスタイル
		const colorStyle = getColorStyle(attributes);

		// ブロックProps
		const blockProps = useBlockProps.save({
			className: classnames(blockName, {
				'has-bg-img': !!media.url,
			}),
			style: style || null,
			'data-height': height || null,
			'data-inner': innerSize || null,
		});

		return (
			<div {...blockProps}>
				{media.url && !isRepeat && <RawHTML>{'<!-- media -->'}</RawHTML>}
				<div className={`${blockName}__color arkb-absLayer`} style={colorStyle}></div>
				{'off' !== filter && (
					<div className={`c-filterLayer -filter-${filter} arkb-absLayer`}></div>
				)}
				<div
					className={`${blockName}__body`}
					data-content={contentPosition.replace(' ', '-')}
				>
					<div className={`${blockName}__bodyInner ark-keep-mt`}>
						<InnerBlocks.Content />
					</div>
				</div>
				<SectionSVG position='top' svgData={svgDataTop} />
				<SectionSVG position='bottom' svgData={svgDataBottom} />
			</div>
		);
	},
	deprecated,
});
