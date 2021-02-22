/**
 * OLリストのカウンターセット
 */
export const setOlListCounter = (clientId, start, reversed) => {
	setTimeout(() => {
		const ol = document.querySelector('ol[data-block="' + clientId + '"]'); // wp5.5 ~
		if (null === ol) return;

		if ('undefined' === typeof start) {
			// あとからstartを消した時用の処理
			ol.style.counterReset = `arkb-ct`;
		} else if (true === reversed) {
			ol.style.counterReset = `arkb-ct ${parseInt(start) + 1}`;
		} else {
			ol.style.counterReset = `arkb-ct ${parseInt(start) - 1}`;
		}
	}, 5);
};
