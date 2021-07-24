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
// import { useSelect } from '@wordpress/data';
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
import blockIcon from './_icon';
import TheSidebar from './_sidebar';
import TheToolbar from './_toolbar';
import { Figure } from './components/Figure';
import { IconContent } from './components/IconContent';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * export edit
 */
const blockName = 'ark-block-boxLink';
// ['core/paragraph', 'core/list', 'core/buttons']
export default (props) => {
	const { attributes, setAttributes } = props;
	const {
		textAlign,
		href,
		useIcon,
		icon,
		iconSize,
		iconColor,
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
		opacity,
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
		[imgSize, onRemoveImage]
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

	// サイズを変えた時の処理
	const updateImageSize = useCallback((sizeSlug, newSizeData) => {
		setAttributes({
			imgSize: sizeSlug,
			imgUrl: newSizeData.url,
			imgW: newSizeData.width,
			imgH: newSizeData.imgH,
		});
	}, []);

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
						imgClass='arkb-boxLink__img arkb-obf-cover'
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
					/>
					<div
						className='arkb-boxLink__layer'
						aria-hidden='true'
						style={{ opacity: '' + (opacity * 0.01).toFixed(2) }}
					></div>
					<IconContent
						{...{ icon, iconSize, iconColor, iconHtml, useIcon, useIconHtml }}
					/>
				</>
			);
		} else if (useIcon) {
			return (
				<IconContent {...{ icon, iconSize, iconColor, iconHtml, useIcon, useIconHtml }} />
			);
		}

		// figure の style
		const figureStyle = {};
		if (isVertical && ratio) {
			figureStyle.paddingTop = `${ratio}%`;
			figureStyle['--ark-thumb_ratio'] = `${ratio}%`;
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
					'arkb-obf-cover': (fixRatio || !isVertical) && !isContain,
					'arkb-obf-contain': (fixRatio || !isVertical) && isContain,
				})}
				onSelect={onSelectImage}
				onSelectURL={onSelectURL}
			/>
		);
	}, [attributes, isBannerStyle, useIconHtml, onSelectImage, onSelectURL]);

	const blockProps = useBlockProps({
		className: blockClass,
		'data-has-icon': !!href,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'arkb-boxLink__content ark-keep-mt--s' },
		{
			allowedBlocks: ['core/paragraph', 'core/list', 'core/buttons'],
			template: [['core/paragraph']],
			templateLock: false,
		}
	);

	// const allFormatTypes = useSelect((select) => select('core/rich-text').getFormatTypes(), []);
	// console.log(allFormatTypes);
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
						updateImageSize,
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
							// allowedFormats={['core/bold', 'core/italic']}
							onChange={(newTitle) => setAttributes({ title: newTitle })}
						/>
						<div {...innerBlocksProps} />
						{more && (
							<div
								className='arkb-boxLink__more'
								role='button'
								tabIndex='0'
								onKeyDown={() => {}}
								onClick={() => {
									setIsURLPickerOpen(true);
								}}
							>
								<span className='arkb-boxLink__more__text'>{more}</span>
								{showMoreArrow && blockIcon.moreArrow}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
