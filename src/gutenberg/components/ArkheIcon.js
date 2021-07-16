/**
 * @Inner dependencies
 */
import { splitIconClass } from '@helper/splitIconClass';
import { ArkheSVG } from '@components/ArkheSVG';

/**
 * @Others dependencies
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

export const ArkheIcon = ({ icon, className, size = null }) => {
	if (!icon) return null;

	const iconData = splitIconClass(icon);
	if (typeof iconData === 'string') {
		if (-1 !== iconData.indexOf('arkb-svg-')) {
			return <ArkheSVG icon={iconData} className={className || null} size={size} />;
		}
		return <i className={classnames(className, icon)}></i>;
	}
	return <FontAwesomeIcon icon={iconData} className={className || null} />;
};
