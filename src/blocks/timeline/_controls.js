/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

import { useDispatch, useSelect } from '@wordpress/data';

export default function (props) {
	const { clientId, attributes, setAttributes } = props;
	const { stepLabel, startNum } = attributes;

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	// ステップブロック（親）のデータを取得
	const stepBlocksData = useSelect(
		(select) => select('core/block-editor').getBlocksByClientId(clientId)[0],
		[clientId]
	);

	return (
		<InspectorControls>
			<PanelBody title={__('ステップ設定', 'arkhe-blocks')}>
				<TextControl
					label={__('「STEP」の文字', 'arkhe-blocks')}
					value={stepLabel}
					onChange={(val) => {
						setAttributes({ stepLabel: val });

						// 子ブロックにも反映
						stepBlocksData.innerBlocks.forEach((block) => {
							updateBlockAttributes(block.clientId, {
								stepLabel: val,
							});
						});
					}}
				/>

				<TextControl
					label={__('始まりの番号', 'arkhe-blocks')}
					value={startNum}
					type='number'
					onChange={(val) => {
						// typeがnumberなので、intに変換してから保存！
						setAttributes({ startNum: parseInt(val) });
					}}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
