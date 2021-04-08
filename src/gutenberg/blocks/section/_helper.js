/**
 * スタイルをセットする関数
 */
export const getBlockStyle = (attributes) => {
	const {
		textColor,
		height,
		heightPC,
		heightSP,
		padPC,
		padSP,
		isRepeat,
		mediaUrl,
		//
	} = attributes;

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	// 内部minheight
	if ('custom' === height) {
		if (heightPC) {
			style['--arkb-section-minH'] = heightPC;
		}
		if (heightSP) {
			style['--arkb-section-minH--sp'] = heightSP;
		}
	}

	// 内部padding用の変数
	const _varPadPC = `${padPC.top} ${padPC.right} ${padPC.bottom} ${padPC.left}`;
	const _varPadSP = `${padSP.top} ${padSP.right} ${padSP.bottom} ${padSP.left}`;

	// 初期値以外であれば
	if ('4rem 2rem 4rem 2em' !== _varPadPC) {
		style['--arkb-section-padding'] = _varPadPC;
	}
	if ('4rem 2rem 4rem 2em' !== _varPadSP) {
		style['--arkb-section-padding--sp'] = _varPadSP;
	}

	// リピート背景画像
	if (isRepeat && mediaUrl) {
		style.backgroundImage = `url(${mediaUrl})`;
		style.backgroundRepeat = 'repeat';
	}

	return style;
};

export const getBlockStyleOld = (attributes) => {
	const {
		textColor,
		heightPC,
		heightSP,
		heightUnitPC,
		heightUnitSP,
		isFullscreen,
		padPC,
		padSP,
		padUnitPC,
		padUnitSP,
		isRepeat,
		mediaUrl,
	} = attributes;

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	// 内部minheight
	if (isFullscreen) {
		style['--arkb-section-minH--pc'] = `100vh`;
		style['--arkb-section-minH--sp'] = `100vh`;
	} else {
		if (heightPC) {
			style['--arkb-section-minH--pc'] = `${heightPC}${heightUnitPC}`;
		}
		if (heightSP) {
			style['--arkb-section-minH--sp'] = `${heightSP}${heightUnitSP}`;
		}
	}

	// 内部padding用の変数
	const _varPadPC = `${padPC}${padUnitPC}`;
	const _varPadSP = `${padSP}${padUnitSP}`;

	if ('4rem' !== _varPadPC) {
		style['--arkb-section-pad--pc'] = _varPadPC;
	}
	if ('4rem' !== _varPadSP) {
		style['--arkb-section-pad--sp'] = _varPadSP;
	}

	// リピート背景画像
	if (isRepeat && mediaUrl) {
		style.backgroundImage = `url(${mediaUrl})`;
		style.backgroundRepeat = 'repeat';
	}

	return style;
};

export const getColorStyle = ({ bgColor, bgGradient, opacity }) => {
	const style = {};

	// グラデーションかどうか
	if (bgGradient) {
		style.background = bgGradient;
	} else {
		style.backgroundColor = bgColor || '#f7f7f7';
	}
	style.opacity = (opacity * 0.01).toFixed(2);
	return style;
};

export const getSvgData = (svgLevel) => {
	if (0 === svgLevel) {
		return {
			isReverse: false,
			height: 0,
		};
	}
	// vwに合わせて 100 >> 10.0
	const height = (svgLevel * 0.1).toFixed(1);

	return {
		isReverse: 0 > svgLevel, // 負の値かどうか
		height: Math.abs(height), // 絶対値
	};
};
