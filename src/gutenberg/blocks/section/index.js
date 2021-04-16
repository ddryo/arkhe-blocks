/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useMemo, useCallback } from '@wordpress/element';
import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalBlockAlignmentMatrixToolbar as BlockAlignmentMatrixToolbar,
} from '@wordpress/block-editor';

import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { Icon, fullscreen } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import deprecated from './deprecated';
import blockIcon from './_icon';
import example from './_example';
import TheSidebar from './_sidebar';
import { SectionSVG } from './components/SectionSVG';
import { BgMedia } from './components/BgMedia';
import { ArkheMarginControl } from '@components/ArkheMarginControl';
import { getPositionClassName } from '@helper/getPositionClassName';
import { getBlockStyle, getColorStyle, getSvgData } from './_helper';

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
 * カスタムブロックの登録
 */
registerBlockType(name, {
	apiVersion,
	title: __('Section', 'arkhe-blocks'),
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
	edit: ({ attributes, setAttributes, isSelected }) => {
		const {
			align,
			mediaUrl,
			innerSize,
			height,
			padPC,
			svgLevelTop,
			svgLevelBottom,
			svgTypeTop,
			svgTypeBottom,
			svgColorTop,
			svgColorBottom,
			contentPosition,
			// isFullscreen,
		} = attributes;

		// useEffect(() => {
		// 	if ('full' !== align && isFullscreen) {
		// 		setAttributes({ isFullscreen: false });
		// 	}
		// }, [align, isFullscreen]);

		// クラス名
		const blockClass = classnames(blockName, {
			'has-bg-img': !!mediaUrl,
			// 'has-position': !!positionClass,
		});

		// スタイルデータ
		const style = useMemo(() => getBlockStyle(attributes), [attributes]);

		// カラーレイヤーのスタイル
		const colorStyle = useMemo(() => getColorStyle(attributes), [attributes]);

		// 背景画像
		const bgMedia = useMemo(() => <BgMedia attributes={attributes} />, [attributes]);

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
			'data-height': height || null,
			'data-inner': innerSize || null,
			'data-v': '2',
			// 'data-fullscreen': isFullscreen ? '1' : null,
		});

		// content位置のクラス
		// const positionClass = getPositionClassName(contentPosition, '');
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__inner ark-keep-mt`,
			},
			{
				template: [['arkhe-blocks/section-heading'], ['core/paragraph']],
				templateLock: false,
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

		const setPosition = useCallback(
			(nextPosition) => {
				// まだ切り替えてなくてもボタン展開する時に実行されてしまう
				if (contentPosition === nextPosition) {
					return;
				}
				setAttributes({ contentPosition: nextPosition });
				// if (-1 !== nextPosition.indexOf(' center')) {
				// 	setAttributes({ padPC: { ...padPC, left: '0px', right: '0px' } });
				// } else if (-1 !== nextPosition.indexOf(' right')) {
				// 	setAttributes({ padPC: { ...padPC, left: '50%', right: '0px' } });
				// } else if (-1 !== nextPosition.indexOf(' left')) {
				// 	setAttributes({ padPC: { ...padPC, left: '0px', right: '50%' } });
				// }
			},
			[contentPosition]
		);

		return (
			<>
				<BlockControls>
					{'full' === align && (
						<>
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
							{/* <ToolbarGroup>
								<ToolbarButton
									className={classnames('components-toolbar__control', {
										'is-pressed': isFullscreen,
									})}
									label={__('Toggle fullscreen', 'arkhe-blocks')}
									icon={<Icon icon={fullscreen} />}
									onClick={() => {
										setAttributes({ isFullscreen: !isFullscreen });
									}}
								/>
							</ToolbarGroup> */}
						</>
					)}
					<BlockAlignmentMatrixToolbar
						label={__('Change content position')}
						value={contentPosition}
						onChange={setPosition}
					/>
					{/* {contentPosition && (
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
					)} */}

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
					<div
						className={`${blockName}__body`}
						data-content={contentPosition.replace(' ', '-')}
					>
						<div {...innerBlocksProps} />
					</div>
					{svgSrcTop}
					{svgSrcBottom}
				</div>
			</>
		);
	},
	// save: deprecated[0].save,
	save: () => {
		return <InnerBlocks.Content />;
	},
	deprecated,
});
