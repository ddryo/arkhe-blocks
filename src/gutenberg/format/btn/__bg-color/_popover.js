/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
// import { useSelect } from '@wordpress/data';
import { useMemo, useCallback } from '@wordpress/element';
import { applyFormat, removeFormat } from '@wordpress/rich-text';
import { ColorPalette, URLPopover, getColorObjectByColorValue } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import getActiveColor from '../../helper/getActiveColor';
import getPopoverAnchorRect from '../../helper/getPopoverAnchorRect';

export default (props) => {
	const { value, name, isAddingColor, onChange, colors } = props;

	const anchorRect = useMemo(() => getPopoverAnchorRect(isAddingColor), []);
	if (!anchorRect) {
		return null;
	}

	// const [setting, setSetting] = useState(undefined);

	// onChange処理
	const onColorChange = useCallback(
		(color) => {
			if (color) {
				const colorObject = getColorObjectByColorValue(colors, color);
				onChange(
					applyFormat(value, {
						type: name,
						attributes: colorObject
							? {
									class: `has-${colorObject.slug}-background-color`,
							  }
							: {
									style: `background-color:${color}`,
							  },
					})
				);
			} else {
				onChange(removeFormat(value, name));
			}
		},
		[colors, onChange]
	);
	const activeColor = useMemo(() => getActiveColor(name, value, colors), [name, value, colors]);

	return (
		<URLPopover anchorRect={anchorRect} {...props}>
			<ColorPalette value={activeColor} onChange={onColorChange} />
		</URLPopover>
	);
};
