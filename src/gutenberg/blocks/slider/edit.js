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
import { useState, useCallback } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { Button, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { plus, chevronLeft, chevronRight } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import { innserSizeIcon } from './_icon';
import SliderSidebar from './_sidebar';
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
		//contentPosition,
	} = attributes;

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
		// moveUpSlide,
		// moveDownSlide,
	};

	const sliderStyle = {};
	if (isRichSlider && 'custom' === height) {
		sliderStyle['--arkb-slider-height'] = heightPC;
		sliderStyle['--arkb-slider-height--sp'] = heightSP;
	}

	// エディター上での表示用
	const blockStyle = {};
	const slideNumPC = options.slideNumPC;
	if (1 < slideNumPC) {
		const slideWidth = (100 / slideNumPC).toFixed(2);
		blockStyle['--arkb-slide-width'] = `${slideWidth}%`;
	}
	const spacePC = options.spacePC;
	if (0 < spacePC) {
		blockStyle['--arkb-slide-space'] = `${spacePC}px`;
	}

	// ブロックprops
	const blockProps = useBlockProps({
		style: blockStyle,
		'data-is-center': options.isCenter,
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
			orientation: 'horizontal',
			renderAppender: false,
		}
	);

	return (
		<>
			<BlockControls>
				{isAlignFull && (
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
				<div className='__navigation -top'>
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
				<div
					className={`${blockName} -${variation}`}
					data-height={isRichSlider ? height : null}
					data-inner={isAlignFull ? innerSize : null}
					style={sliderStyle}
					// data-is-center={options.isCenter}
				>
					<div
						className={classnames('__prev', {
							'-off': 0 === actSlide,
						})}
					>
						<Button
							icon={chevronLeft}
							onClick={() => {
								focusPrev();
							}}
						/>
					</div>
					<div
						className={classnames('__next', {
							'-off': childIDs.length - 1 === actSlide,
						})}
					>
						<Button
							icon={chevronRight}
							onClick={() => {
								focusNext();
							}}
						/>
					</div>
					<SliderContext.Provider value={contextData}>
						<div {...innerBlocksProps} />
					</SliderContext.Provider>
				</div>
				<div className='__navigation -bottom'>
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
