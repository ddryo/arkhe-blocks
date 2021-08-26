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
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
import deprecated from './deprecated';
import TabSidebar from './_sidebar';
import TabNavList from './components/TabNavList';
import { iconColor } from '@blocks/config';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @others dependencies
 */
import classnames from 'classnames';

/**
 * ブロッククラス名
 */
const blockName = 'ark-block-tab';
const childBlockType = 'arkhe-blocks/tab-body';

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
registerBlockType(metadata.name, {
	title: __('Tab', 'arkhe-blocks'),
	description: __('Create tab content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	example,
	styles: [
		{
			name: 'default',
			label: __('Default', 'arkhe-blocks'),
			isDefault: true,
		},
		{
			name: 'box',
			label: _x('Box', 'style', 'arkhe-blocks'),
		},
	],
	attributes: {
		...metadata.attributes,
		...{
			tabHeaders: {
				type: 'array',
				default: [__('Tab', 'arkhe-blocks') + ' 1', __('Tab', 'arkhe-blocks') + ' 2'],
			},
		},
	},

	edit: ({ attributes, setAttributes, clientId }) => {
		const {
			isExample,
			tabId,
			tabHeaders,
			activeTab,
			tabWidth,
			isScrollPC,
			isScrollSP,
		} = attributes;

		// エディタ上での開閉状態を管理
		const [actTab, setActTab] = useState(activeTab);

		const theTabId = tabId || clientId.substring(0, clientId.indexOf('-'));

		// 初回のみ タブIDをセット
		useEffect(() => {
			if (!tabId) {
				setAttributes({ tabId: theTabId });
			}
		}, [tabId, theTabId]);

		// getBlockOrderメソッドの準備 memo: useSelectで取得すると更新のタイミングが遅くなる
		const { getBlockOrder } = wp.data.select('core/block-editor');

		// IDの二重登録チェック
		useEffect(() => {
			if (isExample) return;
			const sameIdBlocks = document.querySelectorAll(`.ark-block-tab[data-tabid="${tabId}"]`);
			if (sameIdBlocks.length > 1) {
				const newID = clientId.substring(0, clientId.indexOf('-'));
				setAttributes({ tabId: newID || '' });

				// タブボディ側
				const tabBodyIDs = getBlockOrder(clientId);
				tabBodyIDs.forEach((_tabBodyID) => {
					updateBlockAttributes(_tabBodyID, { tabId: newID });
				});
			}
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
		//     [clientId, tabHeaders, actCt]
		// );

		// 順序( bodyId )を再セット
		const resetOrder = useCallback(() => {
			const tabBodyIDs = getBlockOrder(clientId); // 子ブロックである tab-body の clientId の配列を取得
			for (let i = 0; i < tabBodyIDs.length; i++) {
				updateBlockAttributes(tabBodyIDs[i], { bodyId: i });
			}
		}, [clientId]);

		// ナビテキスト更新
		const updateTabsHeader = useCallback(
			(header, index) => {
				const newHeaders = tabHeaders.map((item, idx) => {
					if (index === idx) {
						item = header;
					}
					return item;
				});
				setAttributes({ tabHeaders: newHeaders });
			},
			[tabHeaders]
		);

		// タブを前に移動
		const moveUpTab = useCallback(
			(index) => {
				if (0 === index) return; //先頭の場合は動かさない

				const tabBodyIDs = getBlockOrder(clientId);
				const moveBlockID = tabBodyIDs[index];

				// ナビを移動
				const newTabHeaders = tabHeaders;
				moveAt(newTabHeaders, index, index - 1);
				setAttributes({ tabHeaders: newTabHeaders });

				//コンテンツを移動
				moveBlocksUp(moveBlockID, clientId);

				//一つ前の番号をセット。
				setActTab(actTab - 1);

				// bodyId振り直し
				resetOrder();
			},
			[clientId, tabHeaders, actTab, resetOrder]
		);

		// タブを後ろに移動
		const moveDownTab = useCallback(
			(index) => {
				const tabBodyIDs = getBlockOrder(clientId);
				const moveBlockID = tabBodyIDs[index];

				if (tabBodyIDs.length - 1 === index) return; //最後の場合は動かさない

				// ナビを移動
				const newTabHeaders = tabHeaders;
				moveAt(newTabHeaders, index, index + 1);
				setAttributes({ tabHeaders: newTabHeaders });

				//コンテンツを移動
				moveBlocksDown(moveBlockID, clientId);

				//一つ前の番号をセット。
				setActTab(actTab + 1);

				// id振り直し
				resetOrder();
			},
			[clientId, tabHeaders, actTab, resetOrder]
		);

		// タブ追加
		const addTab = useCallback(() => {
			const tabContentBlock = createBlock(childBlockType, {
				tabId,
				activeTab,
			});

			insertBlocks(tabContentBlock, tabHeaders.length, clientId);
			setAttributes({
				tabHeaders: [...tabHeaders, __('Tab', 'arkhe-blocks')],
			});
			resetOrder();

			// 新しく追加されたタブにフォーカス
			setActTab(tabHeaders.length);
		}, [clientId, tabId, activeTab, tabHeaders, resetOrder]);

		// タブ削除
		const removeTab = useCallback(
			(index) => {
				// indexと一致する番号のタブを 削除
				const newHeaders = tabHeaders.filter((el, idx) => idx !== index);
				setAttributes({ tabHeaders: newHeaders });

				// コンテンツブロックも削除
				const tabBodyIDs = getBlockOrder(clientId);
				removeBlocks(tabBodyIDs[index], false);

				//選択中のタブが削除されるので、一つ前の番号をセット。(最初のタブが削除される時はそのまま)
				const newFocusTab = 0 !== index ? actTab - 1 : 0;

				setActTab(newFocusTab);

				// id振り直し
				resetOrder();
			},
			[clientId, tabId, tabHeaders, resetOrder]
		);

		// ブロックprops
		const blockProps = useBlockProps({
			className: classnames(blockName, {
				'-scrollable-pc': isScrollPC,
				'-scrollable-sp': isScrollSP,
			}),
			'data-tabid': tabId,
			'data-is-example': isExample ? '1' : null,
		});

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: 'arkb-tabBody',
			},
			{
				allowedBlocks: [childBlockType],
				templateLock: false,
				template: [
					[childBlockType, { bodyId: 0, tabId: theTabId }],
					[childBlockType, { bodyId: 1, tabId: theTabId }],
				],
				// renderAppender: undefined,
			}
		);

		return (
			<>
				<BlockControls>
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<TabSidebar {...{ attributes, setAttributes, clientId }} />
				</InspectorControls>
				<div {...blockProps}>
					<ul role='tablist' className='arkb-tabList' data-tab-width={tabWidth}>
						<TabNavList
							{...{
								tabHeaders,
								actTab,
								setActTab,
								updateTabsHeader,
								moveUpTab,
								moveDownTab,
								addTab,
								removeTab,
							}}
						/>
					</ul>
					<div {...innerBlocksProps} />
				</div>
				{!isExample && (
					<style>
						{`[data-block="${clientId}"] [data-type="${childBlockType}"]:nth-child(${
							actTab + 1
						}){ display:block; }`}
					</style>
				)}
			</>
		);
	},

	save: ({ attributes }) => {
		const { tabId, tabHeaders, activeTab, tabWidth, isScrollPC, isScrollSP } = attributes;

		const blockProps = useBlockProps.save({
			className: classnames(blockName, {
				'-scrollable-pc': isScrollPC,
				'-scrollable-sp': isScrollSP,
			}),
		});

		return (
			<div {...blockProps}>
				<ul role='tablist' className='arkb-tabList' data-tab-width={tabWidth}>
					{tabHeaders.map((header, index) => (
						<li key={index} className='arkb-tabList__item' role='presentation'>
							<button
								className={`arkb-tabList__button`}
								role='tab'
								aria-selected={activeTab === index ? 'true' : 'false'}
								aria-controls={`tab-${tabId}-${index}`}
							>
								<RawHTML>{header}</RawHTML>
							</button>
						</li>
					))}
				</ul>
				<div className='arkb-tabBody'>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
	deprecated,
});
