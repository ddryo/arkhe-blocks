import { getRectangleFromRange } from '@wordpress/dom';

export default function (isAddingFormat = false) {
	// 選択中の部分
	const selection = window.getSelection();
	if (!selection.rangeCount) {
		return;
	}

	const range = selection.getRangeAt(0);
	if (!range) {
		return;
	}

	// すでにフォーマットが設定されてれば getRectangleFromRange() 使える？
	if (isAddingFormat) {
		return getRectangleFromRange(range);
	}

	let element = range.startContainer;

	// If the caret is right before the element, select the next element.
	element = element.nextElementSibling || element;

	while (element.nodeType !== window.Node.ELEMENT_NODE) {
		element = element.parentNode;
	}

	// 近くのspanを取得
	const closest = element.closest('span');
	if (!closest) {
		return;
	}

	return closest.getBoundingClientRect();
}
