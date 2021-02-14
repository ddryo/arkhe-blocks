/**
 * 親ブロックを調べる
 */
import { useSelect } from '@wordpress/data';

const { clientId } = props;

const parents = useSelect((select) => select('core/block-editor').getBlockParents(clientId), [
	clientId,
]);
console.log(parents);

if (parents.length > 0) {
	// 一つ上の親（ parents の最後の要素 ）を取得
	const parentID = parents[parents.length - 1];
	const parentName = useSelect((select) => select('core/block-editor').getBlockName(parentID), [
		clientId,
	]);
	console.log(parentName);
}
