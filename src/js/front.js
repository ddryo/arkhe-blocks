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

	/**
	 * アコーディオン
	 * 親のariaと兄弟要素のariaを制御。
	 */
	const arkAccs = document.querySelectorAll('[data-ark-acc]');
	arkAccs.forEach((elem) => {
		elem.addEventListener('click', function (e) {
			e.preventDefault();
			toggleAccordion(e);
		});
	});

	function toggleAccordion(e) {
		const acTitle = e.currentTarget;
		const acWrap = acTitle.parentNode;
		const acBody = acTitle.nextElementSibling;
		const acIcon = acTitle.lastElementChild;
		const isExpanded = acWrap.getAttribute('aria-expanded');
		if ('false' === isExpanded) {
			acWrap.setAttribute('aria-expanded', 'true');
			acBody.setAttribute('aria-hidden', 'false');
			acIcon.setAttribute('data-opened', 'true');
		} else {
			acWrap.setAttribute('aria-expanded', 'false');
			acBody.setAttribute('aria-hidden', 'true');
			acIcon.setAttribute('data-opened', 'false');
		}
	}
});
