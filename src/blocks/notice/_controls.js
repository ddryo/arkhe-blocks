/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	BaseControl,
	// ColorPalette,
	ButtonGroup,
	Button,
	TextControl,
} from '@wordpress/components';

/**
 * @Internal dependencies
 */
import ArkheIconPicker from '@components/ArkheIconPicker';

/**
 * キャプションブロック
 */
export default function (props) {
	const { attributes, setAttributes } = props;
	const { icon, type } = attributes;

	const types = [
		{
			value: 'memo',
			icon: 'fas fa-pen',
		},
		{
			value: 'point',
			icon: 'fas fa-lightbulb',
		},
		{
			value: 'ok',
			icon: 'fas fa-check',
		},
		{
			value: 'alert',
			icon: 'fas fa-exclamation-triangle',
		},
		{
			value: 'warning',
			icon: 'fas fa-exclamation-circle',
		},
	];

	// パネル生成
	return (
		<InspectorControls>
			<PanelBody title={__('Notification type', 'arkhe-blocks')} initialOpen={true}>
				<ButtonGroup>
					{types.map((data) => {
						return (
							<Button
								isPrimary={type === data.value}
								key={`ark-${data.value}`}
								onClick={() => {
									// if (!isPro) return;
									setAttributes({
										type: data.value,
										icon: data.icon,
									});
								}}
							>
								{data.value}
							</Button>
						);
					})}
				</ButtonGroup>
			</PanelBody>
			<PanelBody title={__('Icon settings', 'arkhe-blocks')} initialOpen={true}>
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
				<BaseControl>
					<TextControl
						label={__('Icon class', 'arkhe-blocks')}
						help={
							'※ ' + __('The Font Awesome icon is also available. (Output with svg)')
						}
						// type='url'
						value={icon}
						onChange={(val) => {
							setAttributes({ icon: val });
						}}
					/>
				</BaseControl>
			</PanelBody>
		</InspectorControls>
	);
}
