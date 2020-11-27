import classnames from 'classnames/dedupe';
import hasClass from './hasClass';

/**
 * classを付与するメソッド
 */
const setClass = (nowClass, targetClass, classGroup, commonClass = '') => {
	// すでに対象のクラスを所持しているかどうかチェック。（有効なボタンがクリックされたかどうか。）
	if (hasClass(nowClass, targetClass)) {
		targetClass = '';
	}

	let newClass;

	if (classGroup) {
		// classnames に一括で false で受け渡して、同グループのクラスをすべて削除する
		const classInit = {};
		classGroup.map((classname, idx) => {
			classInit[classname] = false;
		});
		if (commonClass) {
			classInit[commonClass] = false;
		}

		// 一旦全て削除
		newClass = classnames(nowClass, classInit);
	}

	if ('' !== targetClass) {
		newClass = classnames(newClass, commonClass, targetClass);
	}
	return newClass;
};
export default setClass;
