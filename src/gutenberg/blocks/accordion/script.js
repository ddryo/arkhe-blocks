/* eslint @wordpress/no-global-event-listener: 0 */
document.addEventListener('DOMContentLoaded', function () {
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
