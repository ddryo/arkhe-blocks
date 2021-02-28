/**
 * @WordPress dependencies
 */
import { getActiveFormat } from '@wordpress/rich-text';
import { getColorObjectByAttributeValues } from '@wordpress/block-editor';

// getActiveColor
export default function (formatName, formatValue, colors) {
	const activeColorFormat = getActiveFormat(formatValue, formatName);
	if (!activeColorFormat) {
		return;
	}

	// スタイルで指定されていれば。
	const styleColor = activeColorFormat.attributes.style;
	if (styleColor) {
		return styleColor.replace(new RegExp(`^background-color:\\s*`), '');
	}
	// クラス名から判断する
	const currentClass = activeColorFormat.attributes.class;
	if (currentClass) {
		const colorSlug = currentClass.replace(/.*has-(.*?)-background-color.*/, '$1');
		const colorObject = getColorObjectByAttributeValues(colors, colorSlug);
		return colorObject.color;
	}
}
