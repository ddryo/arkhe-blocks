import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { memo, useMemo, useCallback } from '@wordpress/element';
// import { getResizedImages } from '@smb/helper';

export default function (props) {
	const { label, id, sizeSlug, sizeOptions, onChange } = props;

	// サイズが取得できなかった場合
	if (1 > sizeOptions.length) return null;

	return (
		<SelectControl label={label} value={sizeSlug} options={sizeOptions} onChange={onChange} />
	);
}
