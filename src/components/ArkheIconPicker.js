/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BaseControl, ButtonGroup, Button } from '@wordpress/components';
import { ArkheIcon } from '@components/ArkheIcon';

/**
 * タブ
 */
function ArkheIconPicker(props) {
	const { icon, onClick } = props;

	// アイコンリスト
	let icons = [
		'arkb-svg-point',
		'arkb-svg-alert',
		'arkb-svg-warning',
		'arkb-svg-check',
		'arkb-svg-pen',
		'arkb-svg-megaphone',
		'arkb-svg-mail',
		'arkb-svg-cart',
		'arkb-svg-thumb_down',
		'arkb-svg-thumb_up',
		// 'arkb-svg-plus',
		// 'arkb-svg-minus',
	];

	if (window.arkheTheme) {
		icons = icons.concat([
			'arkhe-icon-comment',
			'arkhe-icon-posted',
			'arkhe-icon-tag',
			'arkhe-icon-folder',
			'arkhe-icon-home',
			'arkhe-icon-link',
		]);
	}

	return (
		<BaseControl>
			<ButtonGroup className='ark-iconPicker'>
				{icons.map((iconName) => {
					const isSelected = iconName === icon;
					return (
						<Button
							isPrimary={isSelected}
							key={`icon-${iconName}`}
							onClick={() => {
								onClick(iconName, isSelected);
							}}
						>
							<ArkheIcon icon={iconName} />
							{/* <i className='arkhe-blocks-icon' data-icon={iconName}></i> */}
						</Button>
					);
				})}
			</ButtonGroup>
			{!window.arkheTheme && (
				<div className='ark-blocks-help'>
					{__(
						'If you use "Arkhe", you will be able to select the icons provided in the theme itself.',
						'arkhe-blocks'
					)}
				</div>
			)}
		</BaseControl>
	);
}

export default ArkheIconPicker;
