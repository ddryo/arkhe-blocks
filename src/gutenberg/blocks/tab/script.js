// console.log('tab');

/* eslint @wordpress/no-global-event-listener: 0 */
document.addEventListener('DOMContentLoaded', function () {
	const tabButtons = document.querySelectorAll('.arkb-tabList__button');
	tabButtons.forEach((tabBtn) => {
		tabBtn.addEventListener('click', function (e) {
			tabControl(e);
		});
	});
});

/**
 * タブ
 */
function tabControl(e) {
	e.preventDefault();

	// クリックイベントがキー（Enter / space）によって呼び出されたかどうか
	const iskeyClick = 0 === e.clientX;

	// クリックされたボタン要素
	const clickedButton = e.currentTarget;
	const isOpend = 'true' === clickedButton.getAttribute('aria-selected');

	// マウスクリック時はフォーカスを外す
	if (!iskeyClick) {
		clickedButton.blur();
	}

	// すでにオープンされているタブの場合はなにもしない
	if (isOpend) {
		return;
	}

	// 展開させるタブボックスを取得
	const targetID = clickedButton.getAttribute('aria-controls');
	const targetBody = document.getElementById(targetID);
	if (null === targetBody) return;

	// 親のタブリスト
	const parentTabList = clickedButton.closest('[role="tablist"]');

	// 現在選択済みのタブボタンを取得
	const selectedButton = parentTabList.querySelector(
		'.arkb-tabList__item [aria-selected="true"]'
	);

	// すでに展開済みのタブボックスを取得
	const openedBody = targetBody.parentNode.querySelector(
		'.arkb-tabBody__content[aria-hidden="false"]'
	);

	// ariaの処理
	clickedButton.setAttribute('aria-selected', 'true');
	selectedButton.setAttribute('aria-selected', 'false');
	targetBody.setAttribute('aria-hidden', 'false');
	openedBody.setAttribute('aria-hidden', 'true');
}
