/**
 * data-optionをオブジェクト化
 */
export const getParsedOptions = (json) => {
	const obj = {};
	try {
		let options = json.replace('{', '').replace('}', '');
		options = options.split(',');
		options.forEach((elem) => {
			const opt = elem.split(':');
			obj[opt[0]] = opt[1];
		});
		return obj;
	} catch (ex) {
		return {};
	}
};

const isPC = 999 < window.innerWidth ? true : false;

// init Swiper:
const Swiper = window.Swiper;
const arkSlider = document.querySelectorAll('.ark-block-slider');
arkSlider.forEach((slider) => {
	const dataOption = slider.getAttribute('data-option');
	// console.log(dataOption);

	const swiperContainer = slider.querySelector('.swiper-container');

	if (swiperContainer) {
		const options = getParsedOptions(dataOption);

		// スライド枚数
		const slidesPerView = isPC ? options.slideNumPC : options.slideNumSP;

		// スライド間のスペース
		const slidesSpace = isPC ? options.spacePC : options.spaceSP;

		// 自動再生
		const autoplay = parseInt(options.isAuto)
			? {
					delay: parseInt(options.delay) || 5000,
					disableOnInteraction: false,
			  }
			: false;

		// ページネーション
		const pagination =
			'off' === options.pagination
				? false
				: {
						el: '.swiper-pagination',
						type: options.pagination,
						clickable: parseInt(options.isClickable),
						dynamicBullets: parseInt(options.isDynamic),
				  };

		// オプション生成
		const swiperOptions = {
			effect: options.effect,
			loop: parseInt(options.isLoop),
			speed: parseInt(options.speed) || 1200,
			autoplay,
			spaceBetween: parseInt(slidesSpace) || 0,
			slidesPerView: parseFloat(slidesPerView) || 1,
			centeredSlides: parseInt(options.isCenter),
			direction: options.direction || 'horizontal', // vertical
			pagination,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			// And if we need scrollbar
			// scrollbar: {
			// 	el: '.swiper-scrollbar',
			// },
		};
		// console.log(swiperOptions);
		new Swiper(swiperContainer, swiperOptions);
	}
});

// const sw = new Swiper('.swiper-container');
