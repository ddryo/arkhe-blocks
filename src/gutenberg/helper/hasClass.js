/**
 * checkbox による class のつけ外しメソッド
 */
const hasClass = (nowClass, checkClass) => {
	// クラスを配列化 : 完全一致させるため
	const nowClasses = nowClass.split(' ');

	// 対象のクラスを所持しているかどうかチェック。
	return -1 !== nowClasses.indexOf(checkClass);
};
export default hasClass;
