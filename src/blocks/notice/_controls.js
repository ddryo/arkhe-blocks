/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { createInterpolateElement } from '@wordpress/element';
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
import { ArkheSVG } from '@components/ArkheSVG';

/**
 * キャプションブロック
 */
export default function (props) {
	const { attributes, setAttributes } = props;
	const { icon, type } = attributes;

	const types = [
		{
			value: 'point',
			icon: 'arkb-svg-point',
		},
		{
			value: 'alert',
			icon: 'arkb-svg-alert',
		},
		{
			value: 'warning',
			icon: 'arkb-svg-warning',
		},
		{
			value: 'ok',
			icon: 'arkb-svg-check',
		},
		{
			value: 'memo',
			icon: 'arkb-svg-pen',
		},
	];

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

	// パネル生成
	return (
		<InspectorControls>
			<PanelBody title={__('Notification type', 'arkhe-blocks')} initialOpen={true}>
				<ButtonGroup className='ark-notice-btns'>
					{types.map((data) => {
						return (
							<Button
								isPrimary={type === data.value}
								key={`ark-${data.value}`}
								className={`ark-block-notice -${data.value}`}
								onClick={() => {
									// if (!isPro) return;
									setAttributes({
										type: data.value,
										icon: data.icon,
									});
								}}
							>
								{/* {data.value} */}
								<ArkheSVG icon={data.icon} />
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
						help={faNote}
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
