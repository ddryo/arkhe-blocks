/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
// import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	BlockControls,
	//InspectorControls
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { ArkheMarginControl } from '@components/ArkheMarginControl';
import { getIsShowMarginBtn } from './hoc/margin_control.js';
import { setOlListCounter } from './hoc/list_control.js';

/**
 * HOC
 */
addFilter(
	'editor.BlockEdit',
	'arkb-hook/add-controls',
	createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			const { name, attributes, setAttributes, isSelected, clientId } = props;
			const isOlBlock = 'core/list' === name && attributes.ordered;

			/**
			 * ページロード時に一度だけ発火したい処理 ( isSelected のバリデーションを通す前に一度実行 )
			 */
			useEffect(() => {
				if (isOlBlock && 'undefined' !== typeof attributes.start) {
					setOlListCounter(clientId, attributes.start, attributes.reversed);
				}
			}, [clientId]);

			// ここから先は全部 isSelected の時のみ追加
			if (!isSelected) {
				return <BlockEdit {...props} />;
			}

			// リストブロック用の処理
			if (isOlBlock) {
				setOlListCounter(clientId, attributes.start, attributes.reversed);
			}

			// マージンコントロールを表示するかどうか
			const isShowMarginBtn = isSelected ? getIsShowMarginBtn(name) : false;
			return (
				<>
					<BlockEdit {...props} />
					{isShowMarginBtn && (
						<BlockControls>
							<ArkheMarginControl
								className={attributes.className}
								setAttributes={setAttributes}
							/>
						</BlockControls>
					)}

					{/* <InspectorControls>
					<MarginPanel className={attributes.className} setAttributes={setAttributes} />
				</InspectorControls> */}
				</>
			);
		};
	}, 'addMarginControls'),
	10
);
