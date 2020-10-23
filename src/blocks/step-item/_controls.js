/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings, InspectorControls } from '@wordpress/block-editor';

import { PanelBody, TextControl, BaseControl, CheckboxControl } from '@wordpress/components';

export default function (props) {
	const { attributes, setAttributes } = props;
	const { numColor, theLabel, theNum, isHideNum, isHideLabel } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={__('Text settings', 'arkhe-blocks')}>
				<BaseControl>
					<CheckboxControl
						label={__('Hide the number', 'arkhe-blocks')}
						checked={isHideNum}
						onChange={(val) => setAttributes({ isHideNum: val })}
					/>
				</BaseControl>
				<TextControl
					label={__('Number part text', 'arkhe-blocks')}
					value={theNum}
					onChange={(val) => {
						setAttributes({ theNum: val });
					}}
				/>
				<BaseControl>
					<CheckboxControl
						label={__('Hide the text', 'arkhe-blocks')}
						checked={isHideLabel}
						onChange={(val) => setAttributes({ isHideLabel: val })}
					/>
				</BaseControl>
				<TextControl
					label={__('Text of "STEP" part', 'arkhe-blocks')}
					value={theLabel}
					onChange={(val) => {
						setAttributes({ theLabel: val });
					}}
				/>
			</PanelBody>
			<PanelColorSettings
				title={__('Color settings', 'arkhe-blocks')}
				initialOpen={true}
				colorSettings={[
					{
						value: numColor,
						label: __('Color', 'arkhe-blocks'),
						onChange: (value) => {
							setAttributes({ numColor: value });
						},
					},
				]}
			></PanelColorSettings>
		</InspectorControls>
	);
}
