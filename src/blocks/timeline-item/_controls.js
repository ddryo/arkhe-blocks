/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, BaseControl, CheckboxControl } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * @Internal dependencies
 */
import ArkheIconPicker from '@components/ArkheIconPicker';

export default function (props) {
	const { attributes, setAttributes } = props;
	const { color, isFill, icon } = attributes;

	/* eslint jsx-a11y/anchor-has-content: 0 */
	const faNote = createInterpolateElement(
		__('The <a>Font Awesome icon</a> is also available. (Output with svg)'),
		{
			a: (
				<a
					href='https://fontawesome.com/icons?d=gallery'
					target='_blank'
					rel='noopener noreferrer'
				/>
			),
		}
	);

	return (
		<InspectorControls>
			<PanelBody title='シェイプの設定'>
				<BaseControl>
					<CheckboxControl
						label='シェイプを塗りつぶす'
						checked={isFill}
						onChange={(val) => setAttributes({ isFill: val })}
					/>
				</BaseControl>
				<PanelColorSettings
					title='カラー設定'
					initialOpen={true}
					colorSettings={[
						{
							value: color,
							label: '色',
							onChange: (value) => {
								setAttributes({ color: value });
							},
						},
					]}
				></PanelColorSettings>
			</PanelBody>
			<PanelBody title='アイコン設定'>
				<ArkheIconPicker
					icon={icon}
					onClick={(val, isSelected) => {
						if (isSelected) {
							setAttributes({ icon: '' });
						} else {
							setAttributes({
								icon: val,
							});
						}
					}}
				/>
				<TextControl
					label={`アイコン`}
					value={icon}
					help={faNote}
					onChange={(val) => {
						setAttributes({ icon: val });
					}}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
