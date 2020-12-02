/**
 * @WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * @Inner dependencies
 */
import { ArkheIcon } from '@components/ArkheIcon';

export const IconContent = ({ icon, iconSize, iconHtml, useIcon, useIconHtml }) => {
	const iconStyle = {};
	if (iconSize) {
		iconStyle['--arkb-boxlink_icon_size'] = iconSize + 'px';
	}

	if (!useIcon) {
		return null;
	}

	if (useIconHtml) {
		return (
			<figure className='arkb-boxLink__figure -icon -html' style={iconStyle || null}>
				<RawHTML>{iconHtml}</RawHTML>
			</figure>
		);
	}
	return (
		<figure className='arkb-boxLink__figure -icon' style={iconStyle || null}>
			<ArkheIcon icon={icon} className={`arkb-boxLink__icon`} />
		</figure>
	);
};
