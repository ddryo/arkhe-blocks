/* eslint @wordpress/no-global-event-listener: 0 */
document.addEventListener('DOMContentLoaded', function () {
	/**
	 * olのstart属性に対応する
	 */
	(function () {
		const olWithStart = document.querySelectorAll('ol[start]');
		for (let i = 0; i < olWithStart.length; i++) {
			const ol = olWithStart[i];
			const startVal = ol.getAttribute('start');
			const isReversed = ol.getAttribute('reversed');
			if (null === isReversed) {
				ol.style.counterReset = `arkb-ct ${parseInt(startVal) - 1}`;
			} else {
				ol.style.counterReset = `arkb-ct ${parseInt(startVal) + 1}`;
			}
		}
	})();
});
