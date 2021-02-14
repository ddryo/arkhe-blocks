/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, createInterpolateElement } from '@wordpress/element';
import { BaseControl, ButtonGroup, Button, TextControl } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { ArkheIcon } from '@components/ArkheIcon';

/**
 * タブ
 */
const ArkheIconPicker = memo(({ icon, setIcon }) => {
	// アイコンリスト
	const icons = [
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
		'arkb-svg-comment',
		'arkb-svg-home',
		'arkb-svg-person',
		'arkb-svg-star',
		'arkb-svg-heart',
		'arkb-svg-cog',
		'arkb-svg-quill',
		'arkb-svg-link',
		'arkb-svg-blocked',
		'arkb-svg-batsu',
		// 'arkb-svg-image',
	];

	// if (window.arkheTheme) {
	// 	icons = icons.concat([
	// 		'arkhe-icon-comment',
	// 		'arkhe-icon-posted',
	// 		'arkhe-icon-tag',
	// 		'arkhe-icon-folder',
	// 		'arkhe-icon-home',
	// 		'arkhe-icon-link',
	// 	]);
	// }

	/* eslint jsx-a11y/anchor-has-content: 0 */
	const faNote = createInterpolateElement(
		__('The <a>Font Awesome icon</a> is also available. (Output with svg)', 'arkhe-blocks'),
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
		<>
			<BaseControl>
				<ButtonGroup className='ark-iconPicker'>
					{icons.map((iconName) => {
						const isSelected = iconName === icon;
						return (
							<Button
								isPrimary={isSelected}
								key={`icon-${iconName}`}
								onClick={() => {
									setIcon(iconName, isSelected);
								}}
							>
								<ArkheIcon icon={iconName} />
							</Button>
						);
					})}
				</ButtonGroup>
			</BaseControl>
			<TextControl
				label={__('Icon class', 'arkhe-blocks')}
				value={icon}
				help={faNote}
				onChange={(val) => {
					setIcon(val, false);
				}}
			/>
		</>
	);
});

export default ArkheIconPicker;
