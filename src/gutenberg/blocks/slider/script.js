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

	const swiperContainer = slider.querySelector('.swiper-container.-main');

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

		// オプション生成
		const swiperOptions = {
			effect: options.effect,
			// freeMode: true,
			loop: parseInt(options.isLoop),
			speed: parseInt(options.speed) || 1200,
			autoplay,
			spaceBetween: parseInt(slidesSpace) || 0,
			slidesPerView: parseFloat(slidesPerView) || 1,
			centeredSlides: parseInt(options.isCenter),
			direction: options.direction || 'horizontal', // vertical
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			// And if we need scrollbar
			// scrollbar: {
			// 	el: '.swiper-scrollbar',
			// },
		};

		// ページネーション
		switch (options.pagination) {
			case 'off':
				swiperOptions.pagination = false;
				break;
			// case 'scrollbar':
			// 	swiperOptions.scrollbar = {
			// 		el: '.swiper-scrollbar',
			// 		hide: false,
			// 	};
			// 	break;
			default:
				swiperOptions.pagination = {
					el: '.swiper-pagination',
					type: options.pagination,
					clickable: parseInt(options.isClickable),
					dynamicBullets: parseInt(options.isDynamic),
				};
				break;
		}

		if (parseInt(options.showThumb)) {
			const thumbSwiperContainer = slider.querySelector('.swiper-container.-thumb');
			const thumbSwiper = new Swiper(thumbSwiperContainer, {
				spaceBetween: 0,
				slidesPerView: 'auto',
				freeMode: true,
				watchSlidesVisibility: true,
				watchSlidesProgress: true,
			});
			swiperOptions.thumbs = {
				swiper: thumbSwiper,
			};
		}

		// Set Swipwe !
		new Swiper(swiperContainer, swiperOptions);
	}
});

// const sw = new Swiper('.swiper-container');
