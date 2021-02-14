/**
 * getMedia() と getSettings().imageSizes のデータから、必要な情報だけを取り出す。
 *
 * @param {Array} imageSizes メディアサイズの配列
 * @param {Object} media getMedia()で取得したメディアデータ
 */
export default (imageSizes, media) => {
	if (!imageSizes || !media) return [];
	const mediaSizes = media.media_details.sizes;

	// console.log('media', media);
	// console.log('mediaSizes', mediaSizes);
	// console.log('imageSizes', imageSizes);

	const resizedImages = [];
	imageSizes.forEach((size) => {
		if (mediaSizes[size.slug]) {
			resizedImages[size.slug] = {
				url: mediaSizes[size.slug].source_url,
				width: mediaSizes[size.slug].width,
				height: mediaSizes[size.slug].height,
			};
		}
	});
	return resizedImages;
};
