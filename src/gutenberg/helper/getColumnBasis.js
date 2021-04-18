/**
 * getColumnBasis
 */
export default (colmunNum) => {
	const percent = Math.floor(10000 / colmunNum) / 100;
	return percent + '%';
};
