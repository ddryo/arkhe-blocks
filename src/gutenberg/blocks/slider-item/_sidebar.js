/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	// ColorPalette as WpColorPalette,
	// __experimentalUseGradient,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	// TextControl,
	// ColorPicker,
	ColorPalette,
	BaseControl,
	RangeControl,
	// SelectControl,
	// ButtonGroup,
	// Button,
} from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';

/**
 * @Inner dependencies
 */
import { ImageTab } from './components/ImageTab';
import { ArkDeviceTab } from '@components/ArkDeviceTab';
import { UnitNumber } from '@components/UnitNumber';

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

export default ({ attributes, setAttributes, isSelected }) => {
	const {
		mediaId,
		mediaUrl,
		mediaIdSP,
		mediaUrlSP,
		mediaType,
		mediaTypeSP,
		focalPoint,
		focalPointSP,
		isRepeat,
		opacity,
		bgColor,
		bgGradient,
		textColor,
		padPC,
		padSP,
		widthPC,
		widthSP,
	} = attributes;

	const removeImageSP = useCallback(() => {
		// console.log('removeImageSP', opacity);
		setAttributes({
			mediaIdSP: 0,
			mediaUrlSP: '',
			mediaTypeSP: '',
			mediaWidthSP: undefined,
			mediaHeightSP: undefined,
			focalPointSP: undefined,
			//...(!mediaUrl ? { opacity: 100 } : {}), // PC画像もなければ カラー100に。
		});
	}, [setAttributes]);

	const removeImagePC = useCallback(() => {
		// console.log('removeImagePC', opacity);
		setAttributes({
			alt: '',
			mediaId: 0,
			mediaUrl: '',
			mediaType: '',
			mediaWidth: undefined,
			mediaHeight: undefined,
			focalPoint: undefined,
			// ...(!mediaUrlSP ? { opacity: 100 } : {}), // SP画像もなければ カラー100に。
		});
	}, [setAttributes]);

	const setImagePC = useCallback(
		(media) => {
			// console.log('setImagePC', media, opacity);
			setAttributes({
				alt: media.alt,
				mediaId: media.id,
				mediaUrl: media.url,
				mediaType: media.type,
				mediaWidth: media.width,
				mediaHeight: media.height,

				...(100 === opacity ? { opacity: 50 } : {}),
			});

			// セット済みのメディアSPの形式が違う場合は削除する
			if (mediaUrlSP && media.type !== mediaTypeSP) {
				removeImageSP();
			}
		},
		[setAttributes, opacity, mediaTypeSP, removeImageSP]
	);

	const setImageSP = useCallback(
		(media) => {
			// console.log('setImageSP', media);
			setAttributes({
				mediaIdSP: media.id,
				mediaUrlSP: media.url,
				mediaTypeSP: media.type,
				mediaWidthSP: media.width,
				mediaHeightSP: media.height,
			});
		},
		[setAttributes]
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

	return (
		<>
			<PanelBody title={__('Background media setting', 'arkhe-blocks')}>
				{isRepeat && mediaUrl && (
					<div className='arkb-imgPreview'>
						<img src={mediaUrl} alt='' />
					</div>
				)}
				<ImageTab
					{...{
						setImagePC,
						removeImagePC,
						setImageSP,
						removeImageSP,
						mediaType,
						mediaId,
						mediaUrl,
						mediaIdSP,
						mediaUrlSP,
						focalPoint,
						focalPointSP,
						// isRepeat,
						// opacity,
						setAttributes,
					}}
				/>
			</PanelBody>
			<PanelBody title={__('Padding settings', 'arkhe-blocks')}>
				<ArkDeviceTab
					className='-padding'
					controlPC={
						<>
							<UnitNumber
								label={__('Top and bottom padding', 'arkhe-blocks')}
								value={padPC.y}
								units={['px', 'em', 'rem', '%', 'vw']}
								onChange={(newVal) => {
									setAttributes({ padPC: { ...padPC, y: newVal } });
								}}
							/>
							<UnitNumber
								label={__('Left and right padding', 'arkhe-blocks')}
								value={padPC.x}
								units={['px', 'em', 'rem', '%', 'vw']}
								onChange={(newVal) => {
									setAttributes({ padPC: { ...padPC, x: newVal } });
								}}
							/>
							<UnitNumber
								label={__('Content width', 'arkhe-blocks') + '(PC)'}
								value={widthPC}
								units={['%', 'px', 'vw']}
								onChange={(newVal) => {
									setAttributes({ widthPC: newVal });
								}}
							/>
						</>
					}
					controlSP={
						<>
							<UnitNumber
								label={__('Top and bottom padding', 'arkhe-blocks')}
								value={padSP.y}
								units={['px', 'em', 'rem', '%', 'vw']}
								onChange={(newVal) => {
									setAttributes({ padSP: { ...padSP, y: newVal } });
								}}
							/>
							<UnitNumber
								label={__('Left and right padding', 'arkhe-blocks')}
								value={padSP.x}
								units={['px', 'em', 'rem', '%', 'vw']}
								onChange={(newVal) => {
									setAttributes({ padSP: { ...padSP, x: newVal } });
								}}
							/>
							<UnitNumber
								label={__('Content width', 'arkhe-blocks') + '(SP)'}
								value={widthSP}
								units={['%', 'px', 'vw']}
								onChange={(newVal) => {
									setAttributes({ widthSP: newVal });
								}}
							/>
						</>
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
};
