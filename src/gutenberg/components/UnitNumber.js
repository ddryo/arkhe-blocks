/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
// import { memo } from '@wordpress/element';
import { TextControl, SelectControl } from '@wordpress/components';

/**
 * 設定
 */
const UNITS = ['px', 'rem', 'em', '%', 'vw', 'vh'];

/**
 * attributes を数値と単位に分離する
 */
export const getUnitNum = (val) => {
	if (!val) {
		return { num: 0, unit: 'px' };
	}
	const num = val.replace(/[^0-9\.]/g, '');
	const unit = val.replace(/[0-9\.]/g, '');
	return { num: parseFloat(num), unit };
};

/**
 * コンポーネント
 */
export const UnitNumber = (props) => {
	const { label, attr, num, unit, setNum, setUnit, setAttributes } = props;

	return (
		<div className='ark-control--padding'>
			<div className='__label'>{label}</div>
			<TextControl
				autoComplete='off'
				className='__input'
				value={num}
				type='number'
				min={0}
				onChange={(val) => {
					setNum(parseFloat(val));
					setAttributes({ [attr]: `${parseFloat(val)}${unit}` });
				}}
			/>
			<SelectControl
				value={unit}
				options={UNITS.map((_unit) => {
					return { label: _unit, value: _unit };
				})}
				onChange={(val) => {
					setUnit(val);
					setAttributes({ [attr]: `${num}${val}` });
				}}
			/>
		</div>
	);
};
