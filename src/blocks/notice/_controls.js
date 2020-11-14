/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';
import { PanelBody, ButtonGroup, Button } from '@wordpress/components';

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

	const setIcon = useCallback((val, isSelected = false) => {
		const newIcon = isSelected ? '' : val;
		setAttributes({ icon: newIcon });
	}, []);

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
				<ArkheIconPicker icon={icon} setIcon={setIcon} />
			</PanelBody>
		</InspectorControls>
	);
}
