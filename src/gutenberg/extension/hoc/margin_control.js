/**
 * マージンコントロールを表示するブロックかどうか
 */
export const getIsShowMarginBtn = (name) => {
	// コアブロックかどうか
	const isCore = -1 !== name.indexOf('core/');
	if (!isCore) return false;

	// 除去するブロック
	const removalBlocks = ['core/shortcode', 'core/html', 'core/block'];
	const isRemovalBlocks = -1 !== removalBlocks.indexOf(name);

	if (isRemovalBlocks) return false;

	// マージンコントロールを表示するかどうかの設定を取得
	// const arkheBlockSettings = useSelect((select) => {
	// 	return select(swellStore).getSettings();
	// }, []);
	// const showMarginToolBtn = arkheBlockSettings.show_margin_toolbtn;
	// const showMarginToolBtn = 1;
	// if (!showMarginToolBtn) return false;

	// ok.
	return true;
};
