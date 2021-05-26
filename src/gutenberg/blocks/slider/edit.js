/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import {
	// InnerBlocks,
	BlockControls,
	InspectorControls,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useState, useCallback, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { Button, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import { blockIcon, innserSizeIcon } from './_icon';
import { effectOptions } from './_options';
import SliderSidebar from './_sidebar';
import { ArrowBtns } from './components/ArrowBtns';
import { PaginationPreview } from './components/PaginationPreview';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @others dependencies
 */
import classnames from 'classnames';

/**
 * ブロッククラス名
 */
const blockName = 'ark-block-slider';
const childBlockType = 'arkhe-blocks/slider-item';
// const { apiVersion, name, category, keywords, supports } = metadata;

export default ({ attributes, setAttributes, clientId }) => {
	const {
		variation,
		// isExample,
		align,
		innerSize,
		height,
		heightPC,
		heightSP,
		options,
		slideColor,
		//contentPosition,
	} = attributes;

	const slideDirection = options.direction;
	const isAlignFull = 'full' === align;
	const isRichSlider = 'rich' === variation;

	// const [isPreview, setIsPreview] = useState(false);
	// const { getBlocks } = wp.data.select('core/block-editor');

	const { childIDs, childBlocks } = useSelect(
		(select) => {
			return {
				childIDs: select('core/block-editor').getBlockOrder(clientId),
				childBlocks: select('core/block-editor').getBlocks(clientId),
			};
		},
		[clientId]
	);
	const { replaceInnerBlocks, selectBlock } = useDispatch('core/block-editor');

	// アクティブなスライド番号
	const [actSlide, setActSlide] = useState(0);

	// 方向が変わった時
	useEffect(() => {
		setActSlide(0);
	}, [clientId, slideDirection]);

	// スライドを前に移動
	// const moveUpSlide = useCallback(
	// 	(targetId) => {
	// 		moveBlocksUp(targetId, clientId);
	// 	},
	// 	[clientId]
	// );

	// スライドを後ろに移動
	// const moveDownSlide = useCallback(
	// 	(targetId) => {
	// 		moveBlocksDown(targetId, clientId);
	// 	},
	// 	[clientId]
	// );

	// スライドの追加
	const addSlide = useCallback(() => {
		const newSlide = createBlock(childBlockType, { variation });
		const innerBlocks = childBlocks; // getBlocks(clientId);
		replaceInnerBlocks(clientId, [...innerBlocks, newSlide]);

		// 追加下したブロックへフォーカス
		selectBlock(newSlide.clientId);
	}, [clientId, childBlocks]);

	// スライドの削除
	const removeSlide = useCallback(
		(index, isLast) => {
			const innerBlocks = childBlocks; //getBlocks(clientId);
			const newInnerBlocks = innerBlocks.filter((el, idx) => idx !== index);
			replaceInnerBlocks(clientId, newInnerBlocks);

			// 削除後、同じ位置にあるスライドへフォーカス
			const indexToFocus = isLast ? index - 1 : index;
			selectBlock(newInnerBlocks[indexToFocus].clientId);
		},
		[clientId, childBlocks]
	);

	// 前のスライドを選択
	const focusPrev = useCallback(() => {
		const prevIndex = Math.max(0, actSlide - 1);
		setActSlide(prevIndex);
		selectBlock(childIDs[prevIndex]);
	}, [actSlide, childIDs]);

	// 次のスライドを選択
	const focusNext = useCallback(() => {
		const nextIndex = Math.min(childIDs.length - 1, actSlide + 1);
		setActSlide(nextIndex);
		selectBlock(childIDs[nextIndex]);
	}, [actSlide, childIDs]);

	// Contenxt 準備
	const { SliderContext } = window.arkbContext;
	const contextData = {
		parentID: clientId,
		childIDs,
		setActSlide,
		removeSlide,
		direction: slideDirection,
		// moveUpSlide,
		// moveDownSlide,
	};

	const sliderStyle = {};
	if (isRichSlider && 'custom' === height) {
		sliderStyle['--arkb-slider-height'] = heightPC;
		sliderStyle['--arkb-slider-height--sp'] = heightSP;
	}

	// エディター上での表示用
	let isCenter = false;
	const isPC = 999 < window.innerWidth ? true : false;
	const blockStyle = {};
	if (isPC && 1 < options.slideNumPC) {
		const slideWidth = (100 / options.slideNumPC).toFixed(2);
		blockStyle['--arkb-slide-width'] = `${slideWidth}%`;
		isCenter = options.isCenter;
	} else if (!isPC && 1 < options.slideNumSP) {
		const slideWidth = (100 / options.slideNumSP).toFixed(2);
		blockStyle['--arkb-slide-width'] = `${slideWidth}%`;
		isCenter = options.isCenter;
	}
	const spacePC = options.spacePC;
	if (0 < spacePC) {
		blockStyle['--arkb-slide-space'] = `${spacePC}px`;
	}

	if ('#000' !== slideColor) {
		blockStyle['--arkb-slide-color'] = slideColor;
	}

	// ブロックprops
	const blockProps = useBlockProps({
		style: blockStyle,
		'data-is-center': isCenter,
		// 'data-is-example': isExample ? '1' : null,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: `${blockName}__inner`,
		},
		{
			allowedBlocks: [childBlockType],
			templateLock: 'insert',
			template: [
				[childBlockType, { variation }],
				[childBlockType, { variation }],
				[childBlockType, { variation }],
			],
			orientation: slideDirection,
			renderAppender: false,
		}
	);

	//
	const pagenation = options.showThumb ? (
		<div className='__thumbSlider'>
			{childBlocks.map((_block, index) => {
				const media = _block.attributes.media;
				return (
					<button
						key={`slider-thumb-${index}`}
						className={classnames('__thumb', { 'is-active': index === actSlide })}
						onClick={() => {
							setActSlide(index);
							selectBlock(childIDs[index]);
						}}
					>
						{media.url && <img className='arkb-obf-cover' src={media.url} alt='' />}
					</button>
				);
			})}
		</div>
	) : (
		<>
			{childIDs.map((_id, index) => {
				const isActive = index === actSlide;
				return (
					<div
						key={`slider-nav-${index}`}
						className={classnames('__dot', { 'is-active': isActive })}
					>
						<Button
							isPrimary={isActive}
							isSecondary={!isActive}
							onClick={() => {
								setActSlide(index);
								selectBlock(childIDs[index]);
							}}
						>
							<span>{index + 1}</span>
						</Button>
					</div>
				);
			})}
		</>
	);

	return (
		<>
			<BlockControls>
				{isAlignFull && isRichSlider && (
					<ToolbarGroup>
						<ToolbarButton
							className={classnames('components-toolbar__control', {
								'is-pressed': 'full' === innerSize,
							})}
							label={__('To full-width content', 'arkhe-blocks')}
							icon={innserSizeIcon}
							onClick={() => {
								if ('full' !== innerSize) {
									setAttributes({ innerSize: 'full' });
								} else {
									setAttributes({ innerSize: 'article' });
								}
							}}
						/>
					</ToolbarGroup>
				)}
				<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
			</BlockControls>
			<InspectorControls>
				<SliderSidebar {...{ attributes, setAttributes, clientId }} />
			</InspectorControls>
			<div {...blockProps}>
				<div className='__effectHelper'>
					<Icon icon={blockIcon} size={20} />
					{effectOptions[options.effect]}
				</div>
				{/* Start: .ark-block-slider */}
				<div
					className={`${blockName} -${variation}`}
					data-height={isRichSlider ? height : null}
					data-inner={isAlignFull ? innerSize : null}
					data-direction={slideDirection}
					style={sliderStyle}
					// data-is-center={options.isCenter}
				>
					<SliderContext.Provider value={contextData}>
						<div {...innerBlocksProps} />
					</SliderContext.Provider>
					<div className='__arrowBtns' data-show={options.showArrow}>
						<ArrowBtns
							focusPrev={focusPrev}
							focusNext={focusNext}
							actSlide={actSlide}
							maxNum={childIDs.length}
						/>
					</div>
					<PaginationPreview
						type={options.pagination}
						isDynamic={options.isDynamic}
						actNum={actSlide + 1}
						maxNum={childIDs.length}
					/>
				</div>
				{options.showThumb && pagenation}
				{/* End: .ark-block-slider */}
				<div className='__blockNavigations'>
					{!options.showThumb && pagenation}
					<div className='__add'>
						<Button
							icon={plus}
							isPrimary={true}
							onClick={() => {
								addSlide();
							}}
						>
							<span>{__('Add a slide', 'arkhe-blocks')}</span>
						</Button>
					</div>
				</div>
			</div>
			{/* {!isExample && (
				<style>
					{`[data-block="${clientId}"] [data-type="${childBlockType}"]:not(:nth-child(${
						actSlide + 1
					})){ display:none; }`}
				</style>
			)} */}
		</>
	);
};
