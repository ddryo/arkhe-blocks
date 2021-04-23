/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
// import { memo } from '@wordpress/element';
// import { BaseControl, TextControl, SelectControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { __experimentalUnitControl as UnitControl } from '@wordpress/block-editor';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * 設定
 */
const UNITS = ['px', 'rem', 'em', '%', 'vw', 'vh'];

/**
 * attributes を数値と単位に分離する
 */
const getUnitNum = (val) => {
	if (!val) {
		return { num: '', unit: 'px' };
	}

	// 念のため、明示的に文字列へ変換。
	const valString = val.toString();
	const num = valString.replace(/[^0-9\.]/g, '');
	const unit = valString.replace(/[0-9\.]/g, '');
	return { num: parseFloat(num), unit };
};

/**
 * コンポーネント
 * UnitControl: https://github.com/WordPress/gutenberg/blob/3da717b8d0/packages/components/src/unit-control/index.js
 */
export const UnitNumber = (props) => {
	const { value, units, onChange, idKey = '', className = '' } = props;
	const _UNITS = units || UNITS;
	const { num, unit } = getUnitNum(value);

	const instanceId = useInstanceId(UnitControl);
	const inputId = `${idKey}-${instanceId}`;
	// const isPx = unit === 'px';

	// text-transform: uppercase;

	return (
		<div className={classnames('arkb-ctrl--unit', className)}>
			<UnitControl
				id={inputId}
				// isResetValueOnUnitChange // default値に戻すかどうか？
				min={0}
				onBlur={null}
				onChange={(val) => {
					onChange(val);
					// onChange(`${parseFloat(val)}${unit}`);
				}}
				onUnitChange={(val) => {
					// onChange が先に走ってるので、何もする必要ない
					// onChange(`${num}${val}`);
				}}
				step='1'
				// style={{ maxWidth: 80 }}
				unit={unit}
				units={_UNITS.map((_unit) => {
					return { label: _unit, value: _unit };
				})}
				value={num}
			/>
		</div>
	);
};
