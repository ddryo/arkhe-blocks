/**
 * isNewTab から relを再生成
 */
export default (isNewTab, rel) => {
	let newRel = rel || '';
	if (isNewTab) {
		// noopener がまだなければつける
		if (-1 === newRel.indexOf('noopener')) {
			newRel += ' noopener';
		}
		// noreferrer がまだなければつける
		if (-1 === newRel.indexOf('noreferrer')) {
			newRel += ' noreferrer';
		}
	} else {
		// noopener / noreferrer を消す
		newRel = newRel.replace('noopener', '');
		newRel = newRel.replace('noreferrer', '');
	}

	return newRel.trim();
};
