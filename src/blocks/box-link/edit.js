/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useMemo, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	BlockControls,
	InspectorControls,
	MediaReplaceFlow,
	RichText,
	InnerBlocks,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import {
	PanelBody,
	IconButton,
	Toolbar,
	SelectControl,
	TextControl,
	BaseControl,
	RadioControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { Figure } from '@components/Figure';
import getResizedImages from '@helper/getResizedImages';
// import ImageSizeSelectControl from '@components/ImageSizeSelectControl';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-boxLink';
export default function (props) {
	const { className, attributes, setAttributes, isSelected } = props;
	const {
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
	const blockClass = classnames(className, blockName, 'c-boxLink', '-' + layout);

	// 画像削除時の処理（attributesを初期値に戻す）
	const onRemoveImage = useCallback(() => {
		setAttributes({
			imgId: 0,
			imgUrl: '',
			imgAlt: '',
			imgW: '',
			imgH: '',
		});
	}, []);

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
	const updateImagesSize = (sizeSlug) => {
		// console.log(sizeSlug, resizedImages[sizeSlug]);
		const newSizeData = resizedImages[sizeSlug];

		setAttributes({
			imgSize: sizeSlug,
			imgUrl: newSizeData.url,
			imgW: newSizeData.width,
			imgH: newSizeData.imgH,
		});
	};

	const figureClass = classnames('c-boxLink__figure', { 'is-fixed-ratio': fixRatio });
	let figureStyle = null;

	// 横並びかどうかで設定を変更
	if ('horizontal' === layout) {
		figureStyle = ratio ? { flexBasis: `${ratio}%` } : null;
	} else {
		figureStyle = ratio ? { paddingTop: `${ratio}%` } : null;
	}

	const layoutButtons = [
		{
			value: 'vertical',
			label: __('Vertical', 'arkhe-blocks'),
		},
		{
			value: 'horizontal',
			label: __('Horizontal', 'arkhe-blocks'),
		},
	];

	return (
		<>
			<BlockControls>
				{!!imgUrl && (
					<>
						<MediaReplaceFlow
							mediaId={imgId}
							mediaURL={imgUrl}
							allowedTypes={['image']}
							accept='image/*'
							onSelect={onSelectImage}
							onSelectURL={onSelectURL}
						/>
						<Toolbar>
							<IconButton
								className='components-toolbar__control'
								label={__('Delete image', 'arkhe-blocks')}
								icon='no-alt'
								onClick={onRemoveImage}
							/>
						</Toolbar>
					</>
				)}
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('settings', 'arkhe-blocks')} initialOpen={true}>
					<ButtonGroup className='ark-notice-btns'>
						{layoutButtons.map((btn) => {
							return (
								<Button
									isPrimary={layout === btn.value}
									key={`ark-${btn.value}`}
									onClick={() => {
										setAttributes({
											layout: btn.value,
										});
									}}
								>
									{btn.label}
								</Button>
							);
						})}
					</ButtonGroup>
				</PanelBody>
				<PanelBody title={__('settings', 'arkhe-blocks')} initialOpen={true}>
					{0 !== imgId && (
						<SelectControl
							label={__('Image size')}
							value={imgSize}
							options={sizeOptions}
							onChange={updateImagesSize}
						/>
					)}
					<ToggleControl
						label={__('画像比率を固定する', 'arkhe-blocks')}
						checked={fixRatio}
						onChange={(val) => {
							setAttributes({ fixRatio: val });
						}}
					/>
					{fixRatio && (
						<RangeControl
							label={__('画像比率', 'arkhe-blocks') + '(PC)'}
							help={__(
								'デフォルトではアーカイブリストのサムネイルと同じ比率になります。',
								'arkhe-blocks'
							)}
							value={ratio}
							onChange={(val) => {
								setAttributes({ ratio: val });
							}}
							min={1}
							max={100}
							allowReset={true}
						/>
					)}
				</PanelBody>
				<PanelBody title={__('READ MORE', 'arkhe-blocks')} initialOpen={true}>
					<TextControl
						label={__('READ MOREのテキスト', 'arkhe-blocks')}
						// help={faNote}
						value={more}
						onChange={(val) => {
							setAttributes({ more: val });
						}}
					/>
					<ToggleControl
						label={__('矢印アイコンを表示する', 'arkhe-blocks')}
						checked={showMoreArrow}
						onChange={(val) => {
							setAttributes({ showMoreArrow: val });
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<Block.div className={blockClass}>
				<div className='c-boxLink__inner'>
					<Figure
						url={imgUrl}
						id={imgId}
						alt={imgAlt}
						figureClass={figureClass}
						figureStyle={figureStyle}
						imgClass='c-boxLink__img -no-lb'
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
					/>
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
