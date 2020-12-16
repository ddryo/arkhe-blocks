/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	// memo,
	useMemo,
	useCallback,
	useState,
	useEffect,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import {
	RichText,
	BlockControls,
	InspectorControls,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { Figure } from '@components/Figure';
import { IconContent } from './components/IconContent';
import getResizedImages from '@helper/getResizedImages';
import TheSidebar from './_sidebar';
import TheToolbar from './_toolbar';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-boxLink';
export default function (props) {
	const { attributes, setAttributes } = props;
	const {
		textAlign,
		useIcon,
		icon,
		iconSize,
		iconHtml,
		layout,
		imgId,
		imgUrl,
		imgAlt,
		imgSize,
		fixRatio,
		isContain,
		ratio,
		title,
		more,
		showMoreArrow,
	} = attributes;

	// console.log(className, attributes.className);

	const attrClass = attributes.className || '';
	const isBannerStyle = -1 !== attrClass.indexOf('is-style-banner');

	// ブロッククラス
	const blockClass = classnames(blockName, 'arkb-boxLink', 'arkb-columns__item', '-' + layout, {
		'has-text-align-center': 'center' === textAlign,
	});

	// 縦並びか横並びかを変数化
	const isVertical = 'vertical' === layout;

	useEffect(() => {
		if (isBannerStyle) {
			setAttributes({ fixRatio: false });
			setAttributes({ isContain: false });
		}
	}, [isBannerStyle]);

	// state
	const [isURLPickerOpen, setIsURLPickerOpen] = useState(false);
	const [useIconHtml, setUseIconHtml] = useState(!!iconHtml);

	// 画像選択時の処理
	const onSelectImage = useCallback(
		(media) => {
			// console.log(media);

			if (!media || !media.url) {
				onRemoveImage();
				return;
			}

			const hasSizeData = !!media.sizes && !!media.sizes[imgSize];
			const theSizeData = hasSizeData ? media.sizes[imgSize] : [];

			const newImageURL = theSizeData.url || media.url;
			const newImageWidth = theSizeData.width || media.width;
			const newImageHeight = theSizeData.height || media.height;

			setAttributes({
				imgId: media.id,
				imgUrl: newImageURL,
				imgAlt: media.alt,
				imgW: newImageWidth,
				imgH: newImageHeight,
			});
		},
		[imgSize]
	);

	// メディアじゃなくてURLを直接入力した時
	const onSelectURL = useCallback(
		(newURL) => {
			if (newURL !== imgUrl) {
				setAttributes({
					imgSize: 'full',
					imgUrl: newURL,
					imgId: 0,
					imgW: '',
					imgH: '',
					imgAlt: '',
				});
			}
		},
		[imgUrl]
	);

	// 画像削除時の処理（attributesを初期値に戻す）
	const onRemoveImage = useCallback(() => {
		setAttributes({
			imgId: 0,
			imgUrl: undefined,
			imgAlt: undefined,
			imgW: undefined,
			imgH: undefined,
		});
	}, []);

	// メディアサイズリストを取得
	const { sizeOptions, resizedImages } = useSelect(
		(select) => {
			if (!imgId) {
				return {
					sizeOptions: [],
					resizedImages: [],
				};
			}

			const media = select('core').getMedia(imgId);
			if (!media) {
				// mediaが取得できなければ
				return {
					sizeOptions: [],
					resizedImages: [],
				};
			}

			// sizeOptions と resizedImages を生成
			const { getSettings } = select('core/block-editor');
			const { imageSizes } = getSettings();

			const _sizeOptions = imageSizes.map((size) => {
				return {
					label: size.name,
					value: size.slug,
				};
			});

			const _resizedImages = getResizedImages(imageSizes, media);

			return {
				sizeOptions: _sizeOptions,
				resizedImages: _resizedImages,
			};
		},
		[imgId]
	);

	// サイズを変えた時
	const updateImagesSize = useCallback(
		(sizeSlug) => {
			// console.log(sizeSlug, resizedImages[sizeSlug]);
			const newSizeData = resizedImages[sizeSlug] || resizedImages.full;

			setAttributes({
				imgSize: sizeSlug,
				imgUrl: newSizeData.url,
				imgW: newSizeData.width,
				imgH: newSizeData.imgH,
			});
		},
		[resizedImages]
	);

	const figureContent = useMemo(() => {
		if (isBannerStyle) {
			return (
				<>
					<Figure
						url={imgUrl}
						id={imgId}
						alt={imgAlt}
						figureClass='arkb-boxLink__bg'
						figureStyle={null}
						imgClass='arkb-boxLink__img u-obf-cover'
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
					/>
					<IconContent {...{ icon, iconSize, iconHtml, useIcon, useIconHtml }} />
				</>
			);
		} else if (useIcon) {
			return <IconContent {...{ icon, iconSize, iconHtml, useIcon, useIconHtml }} />;
		}

		// figure の style
		const figureStyle = {};
		if (isVertical && ratio) {
			figureStyle.paddingTop = `${ratio}%`;
		} else if (!isVertical && ratio) {
			figureStyle.flexBasis = `${ratio}%`;
		}

		return (
			<Figure
				url={imgUrl}
				id={imgId}
				alt={imgAlt}
				figureClass={classnames('arkb-boxLink__figure', { 'is-fixed-ratio': fixRatio })}
				figureStyle={figureStyle || null}
				imgClass={classnames('arkb-boxLink__img', {
					'u-obf-cover': (fixRatio || !isVertical) && !isContain,
					'u-obf-contain': (fixRatio || !isVertical) && isContain,
				})}
				onSelect={onSelectImage}
				onSelectURL={onSelectURL}
			/>
		);
	}, [attributes, isBannerStyle, useIconHtml, onSelectImage, onSelectURL]);

	const blockProps = useBlockProps({
		className: blockClass,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'arkb-boxLink__content ark-keep-mt--s' },
		{
			allowedBlocks: ['core/paragraph', 'core/list', 'core/buttons'],
			template: [['core/paragraph']],
			templateLock: false,
		}
	);

	return (
		<>
			<BlockControls>
				<TheToolbar
					{...{
						attributes,
						setAttributes,
						onSelectImage,
						onSelectURL,
						onRemoveImage,
						isURLPickerOpen,
						setIsURLPickerOpen,
					}}
				/>
			</BlockControls>
			<InspectorControls>
				<TheSidebar
					{...{
						attributes,
						isBannerStyle,
						setAttributes,
						updateImagesSize,
						sizeOptions,
						useIconHtml,
						setUseIconHtml,
					}}
				/>
			</InspectorControls>
			<div {...blockProps}>
				<div className='arkb-boxLink__inner'>
					{figureContent}
					<div className='arkb-boxLink__body'>
						<RichText
							tagName='div'
							className={`arkb-boxLink__title is-empty-${RichText.isEmpty(title)}`}
							placeholder={__('Enter text', 'arkhe-blocks') + '...'}
							value={title}
							onChange={(newTitle) => setAttributes({ title: newTitle })}
						/>
						<div {...innerBlocksProps} />
						{more && (
							<div className='arkb-boxLink__more'>
								<span className={`arkb-boxLink__more__text`}>{more}</span>
								{showMoreArrow && (
									<svg
										className='arkb-boxLink__more__svg'
										width='16'
										height='16'
										viewBox='0 0 32 32'
										role='img'
										focusable='false'
									>
										<path d='M30.4 16.664l-4.528-4.528-1.128 1.136 3.392 3.392h-26.536v1.6h28.8v-1.6z'></path>
									</svg>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
