/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings, InspectorControls } from '@wordpress/block-editor';

import { PanelBody, TextControl, BaseControl, CheckboxControl } from '@wordpress/components';

export default function (props) {
	const { attributes, setAttributes } = props;
	const { numColor, stepLabel, theLabel, theNum, isHideNum, isHideLabel } = attributes;

	return (
		<InspectorControls>
			<PanelBody title='STEPテキストの上書き設定'>
				<BaseControl>
					<CheckboxControl
						label='番号を非表示にする'
						checked={isHideNum}
						onChange={(val) => setAttributes({ isHideNum: val })}
					/>
				</BaseControl>
				<TextControl
					label={`番号部分のテキスト`}
					value={theNum}
					onChange={(val) => {
						setAttributes({ theNum: val });
					}}
				/>
				<BaseControl>
					<CheckboxControl
						label='テキストを非表示にする'
						checked={isHideLabel}
						onChange={(val) => setAttributes({ isHideLabel: val })}
					/>
				</BaseControl>
				<TextControl
					label={`「${stepLabel}」部分のテキスト`}
					value={theLabel}
					onChange={(val) => {
						setAttributes({ theLabel: val });
					}}
				/>
			</PanelBody>
			<PanelColorSettings
				title='ステップ番号のカラー設定'
				initialOpen={true}
				colorSettings={[
					{
						value: numColor,
						label: '色',
						onChange: (value) => {
							setAttributes({ numColor: value });
						},
					},
				]}
			></PanelColorSettings>
		</InspectorControls>
	);
}
