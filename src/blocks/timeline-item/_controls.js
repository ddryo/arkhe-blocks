/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, BaseControl, CheckboxControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

/**
 * @Internal dependencies
 */
import ArkheIconPicker from '@components/ArkheIconPicker';

export default function (props) {
	const { attributes, setAttributes } = props;
	const { color, isFill, icon } = attributes;

	// アイコン選択時
	const setIcon = useCallback((val, isSelected) => {
		const newIcon = isSelected ? '' : val;
		setAttributes({ icon: newIcon });
	}, []);

	return (
		<InspectorControls>
			<PanelBody title={__('Shape settings', 'arkhe-blocks')}>
				<BaseControl>
					<CheckboxControl
						label={__('Fill the shape', 'arkhe-blocks')}
						checked={isFill}
						onChange={(val) => setAttributes({ isFill: val })}
					/>
				</BaseControl>
				<PanelColorSettings
					title={__('Color settings', 'arkhe-blocks')}
					initialOpen={true}
					colorSettings={[
						{
							value: color,
							label: __('Color', 'arkhe-blocks'),
							onChange: (value) => {
								setAttributes({ color: value });
							},
						},
					]}
				></PanelColorSettings>
			</PanelBody>
			<PanelBody title={__('Icon settings', 'arkhe-blocks')}>
				<ArkheIconPicker icon={icon} setIcon={setIcon} />
			</PanelBody>
		</InspectorControls>
	);
}
