/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { applyFormat, removeFormat } from '@wordpress/rich-text';
import { URLPopover } from '@wordpress/block-editor';
import { ColorPalette } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import getPopoverAnchorRect from '../../helper/getPopoverAnchorRect';

export default function (props) {
	const { value, name, isAddingColor, onChange, colors, activeColor } = props;

	const anchorRect = useMemo(() => getPopoverAnchorRect(isAddingColor), []);
	if (!anchorRect) {
		return null;
	}

	return (
		<URLPopover anchorRect={anchorRect} {...props}>
			<ColorPalette
				value={activeColor}
				colors={colors}
				disableCustomColors={true}
				onChange={(color) => {
					if (color) {
						let className = '';
						if (-1 !== color.indexOf('orange')) {
							className = 'mark_orange';
						}
						if (-1 !== color.indexOf('blue')) {
							className = 'mark_blue';
						}
						if (-1 !== color.indexOf('green')) {
							className = 'mark_green';
						}
						if (-1 !== color.indexOf('yellow')) {
							className = 'mark_yellow';
						}
						onChange(
							applyFormat(value, {
								type: name,
								attributes: {
									class: className,
								},
							})
						);
					} else {
						onChange(removeFormat(value, name));
					}
				}}
			/>
		</URLPopover>
	);
}
