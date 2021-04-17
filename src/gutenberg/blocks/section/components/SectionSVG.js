// import { memo } from '@wordpress/element';

const getPath = (type, isReverse) => {
	if ('line' === type) {
		return isReverse ? (
			<polygon points='0,0 100,0 100,100' />
		) : (
			<polygon points='0,0 0,100 100,0' />
		);
	} else if ('circle' === type) {
		return isReverse ? (
			<path d='M0,0c20.1,133.4,79.9,133.3,100,0H0z' />
		) : (
			<g>
				<path d='M0,100V0h50C30,0,10,33.3,0,100z' />
				<path d='M50,0h50v100C90,33.3,70,0,50,0z' />
			</g>
		);
	} else if ('wave' === type) {
		return isReverse ? (
			<path d='M0,50.3c0.1,0.1,0.1,0.4,0.2,0.6C6.3,75,12.6,100,25,100s18.7-25,24.8-49C56,26.5,62.4,1.3,75,1.3c12.5,0,18.9,24.9,25,49V0 L25,0L0,0L0,50.3z' />
		) : (
			<path d='M100,0H75H0v50.3c6.1-24.2,12.5-49,25-49c12.6,0,19,25.3,25.2,49.7c6.1,24,12.4,49,24.8,49s18.7-25,24.8-49.2 c0.1-0.1,0.1-0.4,0.2-0.6V0z' />
		);
	} else if ('zigzag' === type) {
		return isReverse ? (
			<path d='M0,50.3L25,100c0,0,50-100.3,50-98.8l25,49V0H25H0V50.3z' />
		) : (
			<path d='M100,50.3L75,100c0,0-50-100.3-50-98.8l-25,49V0h75h25V50.3z' />
		);
	}
};

/**
 * <SectionSVG />コンポーネント
 */
export const SectionSVG = ({ position, svgData }) => {
	if (0 === svgData.height) return null;

	const svgStyle = {};
	if (svgData.color) {
		svgStyle.fill = svgData.color;
	}

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 100 100'
			preserveAspectRatio='none'
			className={`ark-block-section__svg -${position}`}
			aria-hidden='true'
			focusable='false'
			style={svgStyle}
		>
			{getPath(svgData.type, svgData.isReverse)}
		</svg>
	);
};

/**
 * 旧 <SectionSVG />コンポーネント
 */
export const SectionSVGOld = ({ position, type, height, isReverse, fillColor }) => {
	if (0 === height) return null;

	const svgStyle = { height: `${height}vw` };
	if (fillColor) {
		svgStyle.fill = fillColor;
	}

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 100 100'
			preserveAspectRatio='none'
			className={`ark-block-section__svg -${position}`}
			aria-hidden='true'
			focusable='false'
			style={svgStyle}
		>
			{getPath(type, isReverse)}
		</svg>
	);
};

// 設定ボタン用
export const getButtonSVG = (type) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 100 100'
			width='32'
			height='24'
			preserveAspectRatio='none'
			aria-hidden='true'
			focusable='false'
		>
			{getPath(type, false)}
		</svg>
	);
};
