/**
 * checkbox による class のつけ外しメソッド
 */
const removeClass = (nowClassNames, removeName) => {
	// クラスを配列化 : 完全一致させるため
	const nowClasses = nowClassNames.split(' ');

	// 削除すべきクラス名の検索
	let removeIndex = null;
	for (let i = 0; i < nowClasses.length; i++) {
		if (nowClasses[i] === removeName) {
			removeIndex = i;
		}
	}
	// 削除すべきクラスが見つかったら、配列から削除
	if (0 === removeIndex) {
		// 0の時はsplice使えない
		nowClasses.shift();
	} else if (null !== removeIndex) {
		nowClasses.splice(removeIndex, removeIndex);
	}

	// 削除後の配列が空だったら空文字を返す
	if (nowClasses === []) return '';

	// 文字列にして返す
	let returnClass = nowClasses.join(' ');

	// 一応、2つ続きの空白を1つにして最後に trim()
	returnClass = returnClass.replace('  ', '').trim();

	return returnClass;
};
export default removeClass;
