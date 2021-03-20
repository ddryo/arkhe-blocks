/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { registerBlockType, createBlock } from '@wordpress/blocks';
import {
	InnerBlocks,
	BlockControls,
	InspectorControls,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { RawHTML, useMemo, useEffect, useState, useCallback } from '@wordpress/element';
import {
	useDispatch,
	//useSelect,
} from '@wordpress/data';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
// import example from './_example';
import metadata from './block.json';
import { ArkheMarginControl } from '@components/ArkheMarginControl';
import SliderSidebar from './_sidebar';
import TabNavList from '../tab/components/TabNavList';

/**
 * @others dependencies
 */
import classnames from 'classnames';

/**
 * ブロッククラス名
 */
const blockName = 'ark-block-slider';
const childBlockType = 'arkhe-blocks/slider-item';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * 配列の要素を移動させる
 */
function moveAt(array, index, at) {
	// 移動下と移動先が同じ場合や、どちらかが配列の長さを超える場合は return
	if (index === at || index > array.length - 1 || at > array.length - 1) {
		return array;
	}

	const value = array[index];
	const tail = array.slice(index + 1);

	array.splice(index);

	Array.prototype.push.apply(array, tail);

	array.splice(at, 0, value);

	return array;
}

/**
 * registerBlockType
 */
registerBlockType(name, {
	apiVersion,
	title: __('Slider', 'arkhe-blocks'),
	description: __('Create slider content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	// example,
	// styles: [
	// 	{
	// 		name: 'default',
	// 		label: __('Default', 'arkhe-blocks'),
	// 		isDefault: true,
	// 	},
	// 	{
	// 		name: 'box',
	// 		label: _x('Box', 'style', 'arkhe-blocks'),
	// 	},
	// ],
	attributes: {
		...metadata.attributes,
		...{
			slideHeaders: {
				type: 'array',
				default: [__('Slider', 'arkhe-blocks') + ' 1', __('Slider', 'arkhe-blocks') + ' 2'],
			},
		},
	},

	edit: ({ attributes, setAttributes, clientId, isSelected }) => {
		const { isExample, align, height } = attributes;

		// console.log(align);

		// 子ブロックの clientId 配列を取得（useSelectで取得すると更新のタイミングが遅くなる
		const { getBlockOrder } = wp.data.select('core/block-editor');

		// エディタ上での開閉状態を管理
		const [actSlider, setActSlider] = useState(0);

		// タブナビゲーション
		const [slideHeaders, setSlideHeaders] = useState([]);

		useEffect(() => {
			const _slideHeaders = [];
			const slideIDs = getBlockOrder(clientId); // 子ブロックである tab-body の clientId の配列を取得
			for (let i = 1; i <= slideIDs.length; i++) {
				_slideHeaders.push(__('Slide', 'arkhe-blocks'));
			}
			setSlideHeaders(_slideHeaders);
		}, [clientId]);

		const {
			removeBlocks,
			insertBlocks,
			updateBlockAttributes,
			moveBlocksUp,
			moveBlocksDown,
		} = useDispatch('core/block-editor');

		// const tabBodyIDs = useSelect(
		//     (select) => wp.select('core/block-editor').getBlocks(clientId)[0],
		//     [clientId, slideHeaders, actCt]
		// );

		// 順序( bodyId )を再セット
		const resetOrder = useCallback(() => {
			const slideIDs = getBlockOrder(clientId); // 子ブロックである tab-body の clientId の配列を取得
			for (let i = 0; i < slideIDs.length; i++) {
				updateBlockAttributes(slideIDs[i], { bodyId: i });
			}
		}, [clientId]);

		// ナビテキスト更新
		// const () => {}) = useCallback(
		// 	(header, index) => {
		// 		const newHeaders = slideHeaders.map((item, idx) => {
		// 			if (index === idx) {
		// 				item = header;
		// 			}
		// 			return item;
		// 		});
		// 		setAttributes({ slideHeaders: newHeaders });
		// 	},
		// 	[slideHeaders]
		// );

		// タブを前に移動
		const moveUpSlider = useCallback(
			(index) => {
				if (0 === index) return; //先頭の場合は動かさない

				const slideIDs = getBlockOrder(clientId);
				const moveBlockID = slideIDs[index];

				// ナビを移動
				const newSliderHeaders = slideHeaders;
				moveAt(newSliderHeaders, index, index - 1);
				setSlideHeaders(newSliderHeaders);

				//コンテンツを移動
				moveBlocksUp(moveBlockID, clientId);

				//一つ前の番号をセット。
				setActSlider(actSlider - 1);

				// slideId振り直し
				resetOrder();
			},
			[clientId, slideHeaders, actSlider, resetOrder]
		);

		// タブを後ろに移動
		const moveDownSlider = useCallback(
			(index) => {
				const slideIDs = getBlockOrder(clientId);
				const moveBlockID = slideIDs[index];

				if (slideIDs.length - 1 === index) return; //最後の場合は動かさない

				// ナビを移動
				const newSliderHeaders = slideHeaders;
				moveAt(newSliderHeaders, index, index + 1);
				setSlideHeaders(newSliderHeaders);

				//コンテンツを移動
				moveBlocksDown(moveBlockID, clientId);

				//一つ前の番号をセット。
				setActSlider(actSlider + 1);

				// id振り直し
				resetOrder();
			},
			[clientId, slideHeaders, actSlider, resetOrder]
		);

		// タブ追加
		const addSlider = useCallback(() => {
			const newSlide = createBlock(childBlockType, {});

			const nowSlideNum = slideHeaders.length;
			insertBlocks(newSlide, nowSlideNum, clientId);
			setSlideHeaders([...slideHeaders, __('Slide', 'arkhe-blocks')]);
			resetOrder();

			// 新しく追加されたタブにフォーカス
			setActSlider(nowSlideNum);
		}, [clientId, slideHeaders, resetOrder]);

		// タブ削除
		const removeSlider = useCallback(
			(index) => {
				// indexと一致する番号のタブを 削除
				const newHeaders = slideHeaders.filter((el, idx) => idx !== index);
				setSlideHeaders(newHeaders);

				// コンテンツブロックも削除
				const slideIDs = getBlockOrder(clientId);
				removeBlocks(slideIDs[index], false);

				//選択中のタブが削除されるので、一つ前の番号をセット。(最初のタブが削除される時はそのまま)
				const newFocusIndex = 0 !== index ? actSlider - 1 : 0;

				setActSlider(newFocusIndex);

				// id振り直し
				resetOrder();
			},
			[clientId, slideHeaders, resetOrder, actSlider]
		);

		// ブロックprops
		const blockProps = useBlockProps({
			className: classnames(blockName),
			'data-height': height,
			// 'data-is-example': isExample ? '1' : null,
		});

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__inner`,
			},
			{
				allowedBlocks: [childBlockType],
				templateLock: false,
				template: [
					[childBlockType, { bodyId: 0 }],
					[childBlockType, { bodyId: 1 }],
				],
				renderAppender: null,
			}
		);

		return (
			<>
				<BlockControls>
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<SliderSidebar {...{ attributes, setAttributes, clientId }} />
				</InspectorControls>
				<div {...blockProps}>
					<ul role='tablist' className='arkb-tabList'>
						<TabNavList
							{...{
								tabHeaders: slideHeaders,
								actTab: actSlider,
								setActTab: setActSlider,
								updateTabsHeader: null,
								moveUpTab: moveUpSlider,
								moveDownTab: moveDownSlider,
								addTab: addSlider,
								removeTab: removeSlider,
							}}
						/>
					</ul>
					<div {...innerBlocksProps} />
				</div>
				{!isExample && (
					<style>
						{`[data-block="${clientId}"] [data-type="${childBlockType}"]:not(:nth-child(${
							actSlider + 1
						})){ display:none; }`}
					</style>
				)}
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			height,
			heightPC,
			heightSP,
			isLoop,
			isAuto,
			isCenter,
			effect,
			speed,
			delay,
			space,
			slideNumPC,
			slideNumSP,
			pagination,
			isClickable,
			isDynamic,
		} = attributes;

		const options = {
			isLoop: isLoop ? 1 : 0,
			isAuto: isAuto ? 1 : 0,
			isCenter: isCenter ? 1 : 0,
			effect,
			speed,
			delay,
			space,
			slideNumPC,
			slideNumSP,
			pagination,
		};
		if ('bullets' === pagination) {
			options.isClickable = isClickable ? 1 : 0;
			options.isDynamic = isDynamic ? 1 : 0;
		}

		let optionsData = JSON.stringify(options);
		optionsData = optionsData.replaceAll('"', '');

		const blockProps = useBlockProps.save({
			className: blockName,
			'data-option': optionsData,
		});

		return (
			<div {...blockProps}>
				<div className={`${blockName}__inner swiper-container`}>
					<div className='swiper-wrapper'>
						<InnerBlocks.Content />
					</div>
					{'off' !== pagination && <div className='swiper-pagination'></div>}
					{/* 

					<?php if ( $SETTING['mv_on_nav'] ) : ?>
						<div class="swiper-button-prev" tabindex="0" role="button" aria-label="Previous slide">
							<svg x="0px" y="0px" viewBox="0 0 136 346" xml:space="preserve">
								<polyline points="123.2,334.2 12.2,173.2 123.8,11.8 " fill="none" stroke="#fff" stroke-width="12" stroke-miterlimit="10"></polyline>
							</svg>
						</div>
						<div class="swiper-button-next" tabindex="0" role="button" aria-label="Next slide">
							<svg x="0px" y="0px" viewBox="0 0 136 346" xml:space="preserve">
								<polyline class="st0" points="12.8,11.8 123.8,172.8 12.2,334.2" fill="none" stroke="#fff" stroke-width="12" stroke-miterlimit="10"></polyline>
							</svg>
						</div>
					<?php endif; ?> */}
				</div>
			</div>
		);
	},
});
