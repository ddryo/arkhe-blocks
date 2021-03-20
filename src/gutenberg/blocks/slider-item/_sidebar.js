/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ColorPalette as WpColorPalette,
	// __experimentalUseGradient,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
	// MediaPlaceholder,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	// ColorPicker,
	ColorPalette,
	BaseControl,
	RangeControl,
	SelectControl,
	ButtonGroup,
	Button,
} from '@wordpress/components';

import { useMemo, useCallback } from '@wordpress/element';

/**
 * @Inner dependencies
 */
import { ImageTab } from './components/ImageTab';

/**
 * 設定
 */
const units = ['px', 'rem', 'em', '%', 'vw', 'vh'];

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
		// mediaTypeSP,
		focalPoint,
		focalPointSP,
		isRepeat,
		opacity,
		bgColor,
		bgGradient,
		textColor,
		padPC,
		padSP,
		padUnitPC,
		padUnitSP,
	} = attributes;

	const setImagePC = useCallback(
		(media) => {
			setAttributes({
				mediaId: media.id,
				mediaUrl: media.url,
				mediaWidth: media.width,
				mediaHeight: media.height,
				mediaType: media.type,
				...(100 === opacity ? { opacity: 50 } : {}),
			});
		},
		[setAttributes, opacity]
	);

	const removeImagePC = useCallback(() => {
		setAttributes({
			mediaId: 0,
			mediaUrl: '',
			mediaWidth: undefined,
			mediaHeight: undefined,
			mediaType: '',
			focalPoint: undefined,
			...(!mediaUrlSP ? { opacity: 100 } : {}), // SP画像もなければ カラー100に。
		});
	}, [setAttributes, opacity, mediaUrlSP]);

	const setImageSP = useCallback(
		(media) => {
			setAttributes({
				mediaIdSP: media.id,
				mediaUrlSP: media.url,
				mediaWidthSP: media.width,
				mediaHeightSP: media.height,
				mediaTypeSP: media.type,
			});
		},
		[setAttributes]
	);

	const removeImageSP = useCallback(() => {
		setAttributes({
			mediaIdSP: 0,
			mediaUrlSP: undefined,
			mediaWidthSP: undefined,
			mediaHeightSP: undefined,
			mediaTypeSP: '',
			focalPointSP: undefined,
			...(!mediaUrl ? { opacity: 100 } : {}), // PC画像もなければ カラー100に。
		});
	}, [setAttributes, opacity, mediaUrl]);

	const setOverlayColor = useCallback(
		(newColor) => {
			setAttributes({ bgColor: newColor });
		},
		[bgColor]
	);

	const setGradientColor = useCallback(
		(newGradient) => {
			// console.log('newGradient', newGradient);
			setAttributes({ bgGradient: newGradient });
		},
		[bgGradient]
	);

	return (
		<>
			<PanelBody title={__('Padding settings', 'arkhe-blocks')}>
				<div className='ark-control--padding'>
					<div className='__label'>
						{__('Top and bottom padding', 'arkhe-blocks') + '(PC)'}
					</div>
					<TextControl
						autoComplete='off'
						className='__input'
						value={padPC}
						type='number'
						// step={0.1}
						min={0}
						onChange={(val) => {
							setAttributes({ padPC: parseFloat(val) }); // intに変換してから保存
						}}
					/>
					<SelectControl
						value={padUnitPC}
						options={units.map((unit) => {
							return { label: unit, value: unit };
						})}
						onChange={(val) => {
							setAttributes({ padUnitPC: val });
						}}
					/>
				</div>
				<div className='ark-control--padding'>
					<div className='__label'>
						{__('Top and bottom padding', 'arkhe-blocks') + '(SP)'}
					</div>
					<TextControl
						autoComplete='off'
						className='__input'
						value={padSP}
						type='number'
						// step={0.1}
						min={0}
						onChange={(val) => {
							setAttributes({ padSP: parseFloat(val) }); // intに変換してから保存
						}}
					/>
					<SelectControl
						value={padUnitSP}
						options={units.map((unit) => {
							return { label: unit, value: unit };
						})}
						onChange={(val) => {
							setAttributes({ padUnitSP: val });
						}}
					/>
				</div>
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
						setAttributes({
							opacity: val,
						});
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
				{'video' !== mediaType && (
					<ToggleControl
						label={__('Repeat the background image', 'arkhe-blocks')}
						checked={isRepeat}
						onChange={(val) => {
							setAttributes({ isRepeat: val });
							if (val) {
								setAttributes({ focalPoint: undefined });
							}
						}}
					/>
				)}
			</PanelBody>
		</>
	);
};
