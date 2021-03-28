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
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
// import { Icon, fullscreen } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
// import metadata from './block.json';
// import blockIcon from './_icon';
// import example from './_example';
// import variations from './_variations';
// import Placeholder from './_placeholder';
import SliderSidebar from './_sidebar';

/**
 * @others dependencies
 */
import { iconColor } from '@blocks/config';
import TabNavList from '../tab/components/TabNavList';
import { ArkheMarginControl } from '@components/ArkheMarginControl';
import classnames from 'classnames';

/**
 * ブロッククラス名
 */
const blockName = 'ark-block-slider';
const childBlockType = 'arkhe-blocks/slider-item';
// const { apiVersion, name, category, keywords, supports } = metadata;

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

export default ({ attributes, setAttributes, clientId }) => {
	const {
		variation,
		isExample,
		// align,
		height,
		heightPC,
		heightSP,
		options,
		//contentPosition,
	} = attributes;

	// const [isPreview, setIsPreview] = useState(false);

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
		// updateBlockAttributes,
		moveBlocksUp,
		moveBlocksDown,
	} = useDispatch('core/block-editor');

	// const tabBodyIDs = useSelect(
	//     (select) => wp.select('core/block-editor').getBlocks(clientId)[0],
	//     [clientId, slideHeaders, actCt]
	// );

	// 順序( bodyId )を再セット
	// const resetOrder = useCallback(() => {
	// 	const slideIDs = getBlockOrder(clientId); // 子ブロックである tab-body の clientId の配列を取得
	// 	for (let i = 0; i < slideIDs.length; i++) {
	// 		updateBlockAttributes(slideIDs[i], { bodyId: i });
	// 	}
	// }, [clientId]);

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
			//resetOrder();
		},
		[clientId, slideHeaders, actSlider]
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
			// resetOrder();
		},
		[clientId, slideHeaders, actSlider]
	);

	// タブ追加
	const addSlider = useCallback(() => {
		const newSlide = createBlock(childBlockType, { variation });

		const nowSlideNum = slideHeaders.length;
		insertBlocks(newSlide, nowSlideNum, clientId);
		setSlideHeaders([...slideHeaders, __('Slide', 'arkhe-blocks')]);
		// resetOrder();

		// 新しく追加されたタブにフォーカス
		setActSlider(nowSlideNum);
	}, [clientId, slideHeaders]);

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
			//resetOrder();
		},
		[clientId, slideHeaders, actSlider]
	);

	const bloclStyle = {};
	if ('custom' === height) {
		bloclStyle['--arkb-slider-height'] = heightPC;
		bloclStyle['--arkb-slider-height--sp'] = heightSP;
	}

	// スライドの幅
	const slideNumPC = options.slideNumPC;
	if (1 < slideNumPC) {
		bloclStyle['--arkb-slide-width'] = `calc(100% / ${slideNumPC})`;
	}

	// ブロックprops
	const blockProps = useBlockProps({
		className: blockName,
		'data-height': height,
		style: bloclStyle,
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
				[childBlockType, { variation }],
				[childBlockType, { variation }],
			],
			renderAppender: null,
		}
	);

	return (
		<>
			<BlockControls>
				{/* <ToolbarGroup>
						<ToolbarButton
							className='components-toolbar__control'
							isPressed={isPreview}
							label={__('Toggle fullscreen', 'arkhe-blocks')}
							onClick={() => {
								setIsPreview(!isPreview);
							}}
						>
							<span>{__('プレビュー', 'arkhe-blocks')}</span>
						</ToolbarButton>
					</ToolbarGroup> */}
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
};
