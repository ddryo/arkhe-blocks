/**
 * マージンコントロールを表示するブロックかどうか
 */
export const getIsShowMarginBtn = (name) => {
	// コア以外に表示するブロック
	const validBlocks = ['loos-hcb/code-block'];
	const isValidBlocks = -1 !== validBlocks.indexOf(name);

	if (isValidBlocks) return true;

	// コアブロックかどうか
	const isCore = -1 !== name.indexOf('core/');
	if (!isCore) return false;

	// 除去するブロック
	const removalBlocks = ['core/shortcode', 'core/html', 'core/block'];
	const isRemovalBlocks = -1 !== removalBlocks.indexOf(name);

	if (isRemovalBlocks) return false;

	// ok.
	return true;
};
