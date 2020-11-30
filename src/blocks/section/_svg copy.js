const getWavePath = (position) => {
	if ('top' === position) {
		return 'M100,5.58c-0.05-0.01-0.1-0.03-0.15-0.04C93.74,3.8,87.42,2,75,2S56.26,3.8,50.15,5.53 C43.97,7.29,37.58,9.11,25,9.11c-12.48,0-18.86-1.79-25-3.53V10h75h25V5.58z';
	}
	return 'M0,4.42c0.05,0.01,0.1,0.03,0.15,0.04C6.26,6.2,12.58,8,25,8s18.74-1.8,24.85-3.53 C56.03,2.71,62.42,0.89,75,0.89c12.48,0,18.86,1.79,25,3.53V0H25H0V4.42z';
};
const getZigZagPath = (position) => {
	if ('top' === position) {
		return 'M100,5.58L75,2c0,0-50,7.22-50,7.11L0,5.58V10h75h25V5.58z';
	}
	return 'M0,4.42L25,8c0,0,50-7.22,50-7.11l25,3.53V0H25H0V4.42z';
};
const getLinePath = (position) => {
	if ('top' === position) {
		const topPath = isRe ? 'M100,0v100H0L100,0z' : 'm0,0 L100,100 L0,100 z';
		return topPath;
	}
	const bottomPath = isRe ? 'M0,0h100L0,100V0z' : 'm0,0 L100,0 L100,100 z';
	return bottomPath;
};
const getCirclePath = (position) => {
	if ('top' === position) {
		return 'M50,0C22.39,0,0,44.77,0,100h100C100,44.77,77.61,0,50,0z';
	}
	return 'M50,100c27.61,0,50-44.77,50-100H0C0,55.23,22.39,100,50,100z';
};

export const SectionSVG = ({ position, heightLevel, fillColor, type, isEdit, isRe }) => {
	// let height = `${heightLevel * 10}px`;
	let height = `${heightLevel}vw`;
	let bgSVG;
	let path;

	// 高さの処理
	if ('wave' !== type) {
		const windowWidth = window.innerWidth;
		if (isEdit && 782 < windowWidth) {
			height = ((windowWidth - 440) * heightLevel) / 100 + 'px';
		}
	}

	// fillの処理
	if ('wave' === type || 'zigzag' === type) {
		fillColor = fillColor.replace('#', '%23');
		if ('wave' === type) path = getWavePath(position);
		if ('zigzag' === type) path = getZigZagPath(position);

		bgSVG = `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none"><path fill="${fillColor}" d="${path}" /></svg>`;

		return (
			<div
				className={`swell-block-fullWide__SVG -${position} -bg`}
				role='presentation'
				style={{
					height,
					backgroundImage: `url('${bgSVG}')`,
				}}
			></div>
		);
	}

	if ('line' === type) path = getLinePath(position, isRe);
	if ('circle' === type) path = getCirclePath(position);

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 100 100'
			preserveAspectRatio='none'
			className={`swell-block-fullWide__SVG -${position}`}
			role='presentation'
			style={{ height }}
		>
			<path d={path} strokewidth='0' fill={fillColor} />
		</svg>
	);
};
