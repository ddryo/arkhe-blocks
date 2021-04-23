/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Tooltip } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';

/**
 * @Inner dependencies
 */
import { UnitNumber } from '@components/UnitNumber';

/**
 * see: https://github.com/WordPress/gutenberg/blob/899286307b/packages/components/src/box-control/linked-button.js
 */
const LinkedButton = ({ isLinked, ...props }) => {
	const label = isLinked ? __('Unlink Sides') : __('Link Sides');

	return (
		<Tooltip text={label}>
			<span className='__link'>
				<Button
					{...props}
					className='component-box-control__linked-button'
					isPrimary={isLinked}
					isSecondary={!isLinked}
					isSmall
					icon={isLinked ? link : linkOff}
					iconSize={16}
					aria-label={label}
				/>
			</span>
		</Tooltip>
	);
};

/**
 * BoxControl
 * https://github.com/WordPress/gutenberg/blob/899286307b/packages/components/src/box-control/index.js
 */
export const PaddingControl = ({ name, value, setAttributes }) => {
	// console.log(name, value);
	const [isLinked, setIsLinked] = useState(false);

	const changeAll = (newVal) => {
		setAttributes({
			[name]: { ...value, top: newVal, left: newVal, right: newVal, bottom: newVal },
		});
	};

	return (
		<>
			<div className='arkb-ctrl--paddings'>
				<LinkedButton
					onClick={() => {
						setIsLinked(!isLinked);
					}}
					isLinked={isLinked}
				/>
				<div className='__center'>
					<span className='__icon'></span>
					{/* <Icon icon={fullscreen} className='__icon' /> */}
				</div>
				<UnitNumber
					className='__top'
					value={value.top}
					onChange={(newVal) => {
						if (isLinked) {
							changeAll(newVal);
						} else {
							setAttributes({ [name]: { ...value, top: newVal } });
						}
					}}
				/>
				<UnitNumber
					className='__bottom'
					value={value.bottom}
					onChange={(newVal) => {
						if (isLinked) {
							changeAll(newVal);
						} else {
							setAttributes({ [name]: { ...value, bottom: newVal } });
						}
					}}
				/>
				<UnitNumber
					className='__left'
					value={value.left}
					onChange={(newVal) => {
						if (isLinked) {
							changeAll(newVal);
						} else {
							setAttributes({ [name]: { ...value, left: newVal } });
						}
					}}
				/>
				<UnitNumber
					className='__right'
					value={value.right}
					onChange={(newVal) => {
						if (isLinked) {
							changeAll(newVal);
						} else {
							setAttributes({ [name]: { ...value, right: newVal } });
						}
					}}
				/>
			</div>
		</>
	);
};
