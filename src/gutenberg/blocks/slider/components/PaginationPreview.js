/**
 * 背景画像のソース
 */
export const PaginationPreview = ({ type, isDynamic, actNum, maxNum }) => {
	if ('off' === type) return '';
	let content = '';
	if ('bullets' === type) {
		const array = [];
		for (let i = 1; i <= maxNum; i++) {
			array.push(i);
		}
		content = (
			<>
				{array.map((i) => {
					return <span key={i} data-active={actNum === i}></span>;
				})}
			</>
		);
	} else if ('progressbar' === type) {
		content = <span style={{ '--arkb-progressbar-scaleX': actNum / maxNum }}></span>;
	} else if ('fraction' === type) {
		content = (
			<span>
				{actNum} / {maxNum}
			</span>
		);
	}
	return (
		<div className={`__pagination -${type}`} data-dynamic={isDynamic}>
			{content}
		</div>
	);
};
