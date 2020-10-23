/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BaseControl, ButtonGroup, Button } from '@wordpress/components';
import { ArkheIcon } from '@components/ArkheIcon';

/**
 * アイコンリスト
 */
const icons = [
	'arkb-svg-point',
	'arkb-svg-alert',
	'arkb-svg-warning',
	'arkb-svg-check',
	'arkb-svg-pen',
	// 'arkb-svg-plus',
	// 'arkb-svg-minus',
	'arkhe-icon-comment',
	'arkhe-icon-posted',
	'arkhe-icon-tag',
	'arkhe-icon-folder',
	'arkhe-icon-home',
	'arkhe-icon-link',

	// 'fas fa-pen',
	// 'fas fa-exclamation-circle',
	// 'fas fa-exclamation-triangle',

	// 'arkhe-icon-quill',
	// 'arkhe-icon-pen',
	// 'arkhe-icon-hatena',
	// 'arkhe-icon-batsu',
	// 'arkhe-icon-light-bulb',
	// 'arkhe-icon-megaphone',
	// 'arkhe-icon-alert',
	// 'arkhe-icon-info',
	// 'arkhe-icon-blocked',
	// 'arkhe-icon-thumb_up',
	// 'arkhe-icon-thumb_down',
	// 'arkhe-icon-star-full',
	// 'arkhe-icon-heart',
	// 'arkhe-icon-bookmarks',
	// 'arkhe-icon-cart',
	// 'arkhe-icon-mail',
	// 'arkhe-icon-person',
	// 'arkhe-icon-bubble',
	// 'arkhe-icon-settings',
	// 'arkhe-icon-phone',
	// 'arkhe-icon-book',
	// 'arkhe-icon-flag',
	// 'arkhe-icon-posted',
];

/**
 * タブ
 */
function ArkheIconPicker(props) {
	const { icon, onClick } = props;

	// Arkheテーマ
	if (!window.arkheTheme) {
		return (
			<div className='ark-blocks-help'>
				{__(
					'Arkheテーマを利用している場合は、Arkheに用意されているアイコンも選べるようになります。',
					'arkhe-blocks'
				)}
			</div>
		);
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
		</BaseControl>
	);
}

export default ArkheIconPicker;
