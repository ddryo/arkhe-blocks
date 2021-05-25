/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { SelectControl } from '@wordpress/components';

/**
 * getMedia() と getSettings().imageSizes のデータから、必要な情報だけを取り出す。
 *
 * @param {Array} imageSizeSetting getSettings().imageSizes で取得したメディアサイズの配列
 * @param {Object} mediaSizes getMedia()で取得したメディアデータに含まれるサイズ情報
 */
const getResizedImages = (imageSizeSetting, mediaSizes) => {
	if (!imageSizeSetting || !mediaSizes) return [];

	const resizedImages = [];
	imageSizeSetting.forEach((size) => {
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

/**
 * export
 */
export const ImageSizeSelect = ({ imgId, imgSize, updateImageSize, className = '' }) => {
	// 設定可能なメディアサイズリストを取得
	const imageSizeSetting = useSelect((select) => {
		const { getSettings } = select('core/block-editor');
		return getSettings().imageSizes;
	}, []);

	// そこからセレクトボックスのoptionsを生成
	const sizeOptions = imageSizeSetting.map((size) => {
		return {
			label: size.name,
			value: size.slug,
		};
	});

	if (!sizeOptions) return null;

	// メディアのサイズデータを取得
	let mediaSizes = {};
	if (imgId) {
		mediaSizes = useSelect(
			(select) => {
				const media = select('core').getMedia(imgId);
				if (!media) return {};
				return media.media_details.sizes;
			},
			[imgId]
		);
	}

	// 各サイズごとの必要なデータを抽出
	const resizedImages = getResizedImages(imageSizeSetting, mediaSizes);
	// console.log('resizedImages', resizedImages);

	return (
		<SelectControl
			className={className}
			label={__('Image size')}
			value={imgSize}
			options={sizeOptions}
			onChange={(sizeSlug) => {
				const newSizeData = resizedImages[sizeSlug] || resizedImages.full;
				updateImageSize(sizeSlug, newSizeData);
			}}
		/>
	);
};
