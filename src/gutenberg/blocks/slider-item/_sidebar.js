/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	// ColorPalette as WpColorPalette,
	// __experimentalUseGradient,
	// __experimentalUnitControl as UnitControl,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	// ToggleControl,
	// TextControl,
	// ColorPicker,
	ColorPalette,
	BaseControl,
	RangeControl,
	// SelectControl,
	// ButtonGroup,
	// Button,
} from '@wordpress/components';
import { useCallback } from '@wordpress/element';
// import { Icon, fullscreen, link, linkOff } from '@wordpress/icons';

/**
 * @Inner dependencies
 */
import { ImageTab } from './components/ImageTab';
import { PaddingControl } from '@components/PaddingControl';
import { ArkDeviceTab } from '@components/ArkDeviceTab';
// import { UnitNumber } from '@components/UnitNumber';

/**
 * 設定
 */
// const units = ['px', 'rem', 'em', '%', 'vw', 'vh'];

const textColorSet = [
	{
		name: __('White', 'arkhe-blocks'),
		color: '#fff',
	},
	{
		name: __('Black', 'arkhe-blocks'),
		color: '#000',
	},
];

export default ({ attributes, setAttributes }) => {
	const {
		variation,
		media,
		mediaSP,
		focalPoint,
		focalPointSP,
		isRepeat,
		opacity,
		bgColor,
		bgGradient,
		textColor,
		paddingPC,
		paddingSP,
	} = attributes;

	const mediaUrl = media.url;
	const mediaUrlSP = mediaSP.url;

	const removeImageSP = useCallback(() => {
		setAttributes({
			mediaSP: {
				id: 0,
				url: '',
				type: '',
				size: 'full',
			},
			focalPointSP: undefined,
		});
	}, [setAttributes]);

	const removeImagePC = useCallback(() => {
		setAttributes({
			alt: '',
			focalPoint: undefined,
			media: {
				id: 0,
				url: '',
				type: '',
				size: 'full',
			},
		});
	}, [setAttributes]);

	const setImagePC = useCallback(
		(newMedia) => {
			setAttributes({
				alt: newMedia.alt,
				media: {
					id: newMedia.id,
					url: newMedia.url,
					type: newMedia.type,
					size: 'full',
					width: newMedia.width,
					height: newMedia.height,
				},
				...(100 === opacity ? { opacity: 50 } : {}),
			});

			// セット済みのメディアSPの形式が違う場合は削除する
			if (mediaUrlSP && newMedia.type !== mediaSP.type) {
				removeImageSP();
			}
		},
		[setAttributes, opacity, mediaSP, removeImageSP]
	);

	const setImageSP = useCallback(
		(newMedia) => {
			// console.log('setImageSP', newMedia);
			setAttributes({
				mediaSP: {
					id: newMedia.id,
					url: newMedia.url,
					type: newMedia.type,
					size: 'full',
					width: newMedia.width,
					height: newMedia.height,
				},
			});
		},
		[setAttributes]
	);

	// サイズを変えた時の処理
	const updateImageSizePC = useCallback(
		(sizeSlug, newSizeData) => {
			setAttributes({
				media: {
					...media,
					...{
						size: sizeSlug,
						url: newSizeData.url,
						width: newSizeData.width,
						height: newSizeData.imgH,
					},
				},
			});
		},
		[media]
	);
	const updateImageSizeSP = useCallback(
		(sizeSlug, newSizeData) => {
			setAttributes({
				mediaSP: {
					...mediaSP,
					...{
						size: sizeSlug,
						url: newSizeData.url,
						width: newSizeData.width,
						height: newSizeData.imgH,
					},
				},
			});
		},
		[mediaSP]
	);

	const setOverlayColor = useCallback(
		(newColor) => {
			setAttributes({ bgColor: newColor });
		},
		[bgColor]
	);

	const setGradientColor = useCallback(
		(newGradient) => {
			setAttributes({ bgGradient: newGradient });
		},
		[bgGradient]
	);

	// Richスライダー用の設定
	const isRichSlider = 'rich' === variation;
	let richControls = null;
	if (isRichSlider) {
		richControls = (
			<>
				<PanelBody title={__('Padding settings', 'arkhe-blocks')}>
					<ArkDeviceTab
						className='-padding'
						controlPC={
							<PaddingControl
								name='paddingPC'
								value={paddingPC}
								setAttributes={setAttributes}
							/>
						}
						controlSP={
							<PaddingControl
								name='paddingSP'
								value={paddingSP}
								setAttributes={setAttributes}
							/>
						}
					/>
				</PanelBody>
				<PanelColorGradientSettings
					title={__('Color settings', 'arkhe-blocks')}
					initialOpen={true}
					settings={[
						{
							colorValue: bgColor,
							gradientValue: bgGradient,
							onColorChange: setOverlayColor,
							onGradientChange: setGradientColor,
							label: mediaUrl
								? __('Overlay color', 'arkhe-blocks')
								: __('Background color', 'arkhe-blocks'),
						},
					]}
				>
					<RangeControl
						label={
							mediaUrl
								? __('Overlay opacity', 'arkhe-blocks')
								: __('Background opacity', 'arkhe-blocks')
						}
						value={opacity}
						onChange={(val) => {
							setAttributes({ opacity: val });
						}}
						min={0}
						max={100}
					/>
					<BaseControl>
						<BaseControl.VisualLabel>
							{__('Text color', 'arkhe-blocks')}
						</BaseControl.VisualLabel>
						<ColorPalette
							value={textColor}
							colors={textColorSet}
							onChange={(val) => {
								setAttributes({ textColor: val });
							}}
						/>
					</BaseControl>
				</PanelColorGradientSettings>
			</>
		);
	}

	return (
		<>
			<PanelBody
				title={
					isRichSlider
						? __('Background media setting', 'arkhe-blocks')
						: __('Media setting', 'arkhe-blocks')
				}
			>
				{isRepeat && mediaUrl && (
					<div className='arkb-imgPreview'>
						<img src={mediaUrl} alt='' />
					</div>
				)}
				<ImageTab
					{...{
						isRichSlider,
						setImagePC,
						removeImagePC,
						setImageSP,
						removeImageSP,
						updateImageSizePC,
						updateImageSizeSP,
						media,
						mediaSP,
						focalPoint,
						focalPointSP,
						setAttributes,
					}}
				/>
			</PanelBody>
			{richControls}
		</>
	);
};
