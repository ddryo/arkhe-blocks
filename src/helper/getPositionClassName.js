/**
 * 参考 : カバーブロックの getPositionClassName()
 */
const POSITION_CLASSNAMES = {
	'top left': 'is-position-top-left',
	'top center': 'is-position-top-center',
	'top right': 'is-position-top-right',
	'center left': 'is-position-center-left',
	'center center': 'is-position-center-center',
	'center right': 'is-position-center-right',
	'bottom left': 'is-position-bottom-left',
	'bottom center': 'is-position-bottom-center',
	'bottom right': 'is-position-bottom-right',
};

export function getPositionClassName(contentPosition, defaultPosition) {
	if (!contentPosition || defaultPosition === contentPosition) return '';
	return POSITION_CLASSNAMES[contentPosition];
}
