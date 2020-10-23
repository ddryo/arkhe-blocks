/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { BaseControl, ButtonGroup, Button } from '@wordpress/components';

/**
 * アイコンリスト
 */
const icons = [
	'arkb-icon-add',
	'arkb-icon-remove',
	'fas fa-pen',
	'fas fa-exclamation-circle',
	'fas fa-exclamation-triangle',
	// 'icon-check',
	// 'icon-quill',
	// 'icon-pen',
	// 'icon-hatena',
	// 'icon-batsu',
	// 'icon-light-bulb',
	// 'icon-megaphone',
	// 'icon-alert',
	// 'icon-info',
	// 'icon-blocked',
	// 'icon-thumb_up',
	// 'icon-thumb_down',
	// 'icon-star-full',
	// 'icon-heart',
	// 'icon-bookmarks',
	// 'icon-cart',
	// 'icon-mail',
	// 'icon-person',
	// 'icon-bubble',
	// 'icon-settings',
	// 'icon-phone',
	// 'icon-book',
	// 'icon-flag',
	// 'icon-posted',
	// 'icon-swell',
];

/**
 * タブ
 */
function ArkheIconPicker(props) {
	const { icon, onClick } = props;

	return (
		<BaseControl>
			<ButtonGroup className='ark-btns--icons'>
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
							<i className='arkhe-blocks-icon' data-icon={iconName}></i>
						</Button>
					);
				})}
			</ButtonGroup>
		</BaseControl>
	);
}

export default ArkheIconPicker;
