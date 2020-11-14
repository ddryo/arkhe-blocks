/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useMemo, useCallback, useState, RawHTML } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import {
	// BlockControls,
	// InspectorControls,
	// MediaReplaceFlow,
	RichText,
	InnerBlocks,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
// import {
// 	ToggleControl,
// 	RangeControl,
// 	ToolbarButton,
// 	ToolbarGroup,
// 	Popover,
// } from '@wordpress/components';
// import { link } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import { Figure } from '@components/Figure';
import { ArkheIcon } from '@components/ArkheIcon';
import getResizedImages from '@helper/getResizedImages';
// import getNewLinkRel from '@helper/getNewLinkRel';
import ThisControls from './_controls';

// import ImageSizeSelectControl from '@components/ImageSizeSelectControl';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-boxLink';
export default function (props) {
	const { className, attributes, setAttributes } = props;
	const {
		align,
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
		ratio,
		title,
		more,
		showMoreArrow,
	} = attributes;

	// console.log(className, attributes.className);

	const attrClass = attributes.className || '';
	const isBannerStyle = -1 !== attrClass.indexOf('is-style-banner');

	// ブロッククラス
	const blockClass = classnames(className, blockName, 'c-boxLink', '-' + layout, {
		'has-text-align-center': 'center' === align,
	});

	// 縦並びか横並びかを変数化
	const isVertical = 'vertical' === layout;

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
			const newSizeData = resizedImages[sizeSlug];

			setAttributes({
				imgSize: sizeSlug,
				imgUrl: newSizeData.url,
				imgW: newSizeData.width,
				imgH: newSizeData.imgH,
			});
		},
		[resizedImages]
	);

	// アイコン
	const iconStyle = !iconSize
		? null
		: {
				'--arkb-boxlink_icon_size': iconSize + 'px',
		  };
	let iconContent = null;
	if (useIcon && useIconHtml) {
		iconContent = (
			<figure className='c-boxLink__figure -icon -html' style={iconStyle}>
				<RawHTML>{iconHtml}</RawHTML>
			</figure>
		);
	} else if (useIcon) {
		iconContent = (
			<figure className='c-boxLink__figure -icon' style={iconStyle}>
				<ArkheIcon icon={icon} className={`c-boxLink__icon`} />
			</figure>
		);
	}

	// figure
	let figure = '';
	if (isBannerStyle) {
		figure = (
			<>
				<Figure
					url={imgUrl}
					id={imgId}
					alt={imgAlt}
					figureClass='c-boxLink__bg'
					figureStyle={null}
					imgClass='c-boxLink__img -no-lb'
					onSelect={onSelectImage}
					onSelectURL={onSelectURL}
				/>
				{iconContent}
			</>
		);
	} else if (useIcon) {
		figure = iconContent;
	} else {
		// figure の style
		let figureStyle = null;
		if (isVertical) {
			figureStyle = ratio ? { paddingTop: `${ratio}%` } : null;
		} else {
			figureStyle = ratio ? { flexBasis: `${ratio}%` } : null;
		}

		figure = (
			<Figure
				url={imgUrl}
				id={imgId}
				alt={imgAlt}
				figureClass={classnames('c-boxLink__figure', { 'is-fixed-ratio': fixRatio })}
				figureStyle={figureStyle}
				imgClass='c-boxLink__img -no-lb'
				onSelect={onSelectImage}
				onSelectURL={onSelectURL}
			/>
		);
	}

	return (
		<>
			<ThisControls
				attributes={attributes}
				setAttributes={setAttributes}
				onSelectImage={onSelectImage}
				onSelectURL={onSelectURL}
				onRemoveImage={onRemoveImage}
				updateImagesSize={updateImagesSize}
				sizeOptions={sizeOptions}
				isURLPickerOpen={isURLPickerOpen}
				setIsURLPickerOpen={setIsURLPickerOpen}
				useIconHtml={useIconHtml}
				setUseIconHtml={setUseIconHtml}
			/>
			<Block.div className={blockClass}>
				<div className='c-boxLink__inner'>
					{figure}
					<div className='c-boxLink__body'>
						<RichText
							tagName='div'
							className={`c-boxLink__title is-empty-${RichText.isEmpty(title)}`}
							placeholder={__('Enter text', 'arkhe-blocks') + '...'}
							value={title}
							onChange={(newTitle) => setAttributes({ title: newTitle })}
						/>

						<InnerBlocks
							allowedBlocks={['core/paragraph', 'core/list', 'core/buttons']}
							templateLock={false}
							template={[['core/paragraph']]}
							__experimentalTagName='div'
							__experimentalPassedProps={{
								className: 'c-boxLink__content ark-keep-mt--s',
							}}
						/>
						{more && (
							<div className='c-boxLink__more'>
								<span className={`c-boxLink__more__text`}>{more}</span>
								{showMoreArrow && (
									<svg
										className='c-boxLink__more__svg'
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
			</Block.div>
		</>
	);
}
