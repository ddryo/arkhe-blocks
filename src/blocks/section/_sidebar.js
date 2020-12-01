/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	ColorPalette as WpColorPalette,
	// getColorObjectByColorValue,
	// MediaPlaceholder,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	ColorPicker,
	ColorPalette,
	BaseControl,
	RangeControl,
	SelectControl,
	ButtonGroup,
	Button,
} from '@wordpress/components';

import { useCallback } from '@wordpress/element';
// import { useState } from '@wordpress/element';

/**
 * @Inner dependencies
 */
import { ImageTab } from './components/ImageTab';

/**
 * 設定
 */
const padUnits = ['px', 'rem', 'em', '%', 'vw', 'vh'];

const textColorSet = [
	{
		name: '白',
		color: '#fff',
	},
	{
		name: '黒',
		color: '#000',
	},
];

const innerSizes = [
	{
		label: 'コンテンツ幅',
		value: '',
	},
	{
		label: 'フル幅',
		value: 'full',
	},
];

const svgTypes = [
	{
		label: '斜線',
		value: 'line',
	},
	{
		label: '円',
		value: 'circle',
	},
	{
		label: '波',
		value: 'wave',
	},
	{
		label: 'ジグザグ',
		value: 'zigzag',
	},
];

export default ({ attributes, setAttributes }) => {
	// const { attributes, setAttributes } = props;

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
		textColor,
		padPC,
		padSP,
		padUnitPC,
		padUnitSP,
		innerSize,
		svgLevelTop,
		svgLevelBottom,
		svgTypeTop,
		svgTypeBottom,
		svgColorTop,
		svgColorBottom,
	} = attributes;

	// 画像設定タブに渡す情報
	const mediaAttrs = {
		mediaId,
		mediaUrl,
		mediaIdSP,
		mediaUrlSP,
		focalPoint,
		focalPointSP,
		isRepeat,
	};
	const setImagePC = useCallback(
		(media) => {
			// console.log(media);
			setAttributes({
				mediaId: media.id,
				mediaUrl: media.url,
				mediaWidth: media.width,
				mediaHeight: media.height,
				mediaType: media.type,
				...(100 === opacity ? { opacity: 50 } : {}),
			});
		},
		[opacity]
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
	}, [mediaUrlSP]);

	const setImageSP = useCallback((media) => {
		setAttributes({
			mediaIdSP: media.id,
			mediaUrlSP: media.url,
			mediaWidthSP: media.width,
			mediaHeightSP: media.height,
			mediaTypeSP: media.type,
		});
	}, []);

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
	}, [mediaUrl]);

	const setFocalPointPC = useCallback((val) => {
		setAttributes({ focalPoint: val });
	}, []);
	const setFocalPointSP = useCallback((val) => {
		setAttributes({ focalPointSP: val });
	}, []);

	return (
		<InspectorControls>
			<PanelBody title={__('Size settings', 'arkhe-blocks')}>
				<BaseControl>
					<BaseControl.VisualLabel>
						{__('コンテンツの横幅', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<ButtonGroup>
						{innerSizes.map((size) => {
							return (
								<Button
									isSecondary={size.value !== innerSize}
									isPrimary={size.value === innerSize}
									onClick={() => {
										setAttributes({
											innerSize: size.value,
										});
									}}
									key={`key_${size.value}`}
								>
									{size.label}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<div className='ark-control--padding'>
					<div className='__label'>{__('上下のpadding量', 'arkhe-blocks') + '(PC)'}</div>
					<TextControl
						className='__input'
						value={padPC}
						type='number'
						onChange={(val) => {
							setAttributes({ padPC: parseInt(val) }); // intに変換してから保存
						}}
					/>
					<SelectControl
						value={padUnitPC}
						options={padUnits.map((unit) => {
							return { label: unit, value: unit };
						})}
						onChange={(val) => {
							setAttributes({ padUnitPC: val });
						}}
					/>
				</div>
				<div className='ark-control--padding'>
					<div className='__label'>{__('上下のpadding量', 'arkhe-blocks') + '(SP)'}</div>
					<TextControl
						className='__input'
						value={padSP}
						type='number'
						onChange={(val) => {
							setAttributes({ padSP: parseInt(val) }); // intに変換してから保存
						}}
					/>
					<SelectControl
						value={padUnitSP}
						options={padUnits.map((unit) => {
							return { label: unit, value: unit };
						})}
						onChange={(val) => {
							setAttributes({ padUnitSP: val });
						}}
					/>
				</div>
			</PanelBody>
			<PanelBody title={__('Color settings', 'arkhe-blocks')}>
				<BaseControl>
					<BaseControl.VisualLabel>
						{__('テキストカラー', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<ColorPalette
						value={textColor}
						colors={textColorSet}
						onChange={(val) => {
							setAttributes({ textColor: val });
						}}
					/>
				</BaseControl>
				<BaseControl>
					<BaseControl.VisualLabel>
						{mediaUrl ? 'オーバーレイカラー' : '背景色'}
					</BaseControl.VisualLabel>
					<ColorPicker
						className='arkb-colorPicker'
						clearable={false}
						color={bgColor}
						disableAlpha
						onChangeComplete={(val) => {
							// 不透明度の考慮はしなくていい
							setAttributes({ bgColor: val.hex });
						}}
					/>
				</BaseControl>
				<RangeControl
					label={mediaUrl ? 'オーバーレイの不透明度' : '背景色の不透明度'}
					value={opacity}
					onChange={(val) => {
						setAttributes({
							opacity: val,
						});
					}}
					min={0}
					max={100}
				/>
			</PanelBody>
			<PanelBody title='背景メディアの設定'>
				{isRepeat && mediaUrl && (
					<div className='arkb-imgPreview'>
						<img src={mediaUrl} alt='' />
					</div>
				)}
				<ImageTab
					attribute={mediaAttrs}
					setImagePC={setImagePC}
					removeImagePC={removeImagePC}
					setImageSP={setImageSP}
					removeImageSP={removeImageSP}
					setFocalPointPC={setFocalPointPC}
					setFocalPointSP={setFocalPointSP}
				/>
				{'video' !== mediaType && (
					<ToggleControl
						label={__('背景画像をリピートする', 'arkhe-blocks')}
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
			<PanelBody title={__('上部の境界線', 'arkhe-blocks')} initialOpen={0 !== svgLevelTop}>
				<BaseControl>
					<BaseControl.VisualLabel>{__('形状', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns-minWidth'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type.value !== svgTypeTop}
									isPrimary={type.value === svgTypeTop}
									onClick={() => {
										setAttributes({
											svgTypeTop: type.value,
										});
									}}
									key={`key_${type.value}`}
								>
									{type.label}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<RangeControl
					label={__('高さレベル', 'arkhe-blocks')}
					value={svgLevelTop}
					onChange={(val) => {
						setAttributes({
							svgLevelTop: val,
						});
					}}
					min={-100}
					max={100}
					step={1}
				/>
				<div className='components-base-control'>
					<div className='components-base-control__label'>
						{__('Color', 'arkhe-blocks')}
					</div>
					<WpColorPalette
						value={svgColorTop}
						onChange={(color) => {
							setAttributes({ svgColorTop: color });
						}}
						clearable={true}
					/>
				</div>
			</PanelBody>
			<PanelBody
				title={__('下部の境界線', 'arkhe-blocks')}
				initialOpen={0 !== svgLevelBottom}
			>
				<BaseControl>
					<BaseControl.VisualLabel>{__('形状', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns-minWidth'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type.value !== svgTypeBottom}
									isPrimary={type.value === svgTypeBottom}
									onClick={() => {
										setAttributes({ svgTypeBottom: type.value });
									}}
									key={`key_${type.value}`}
								>
									{type.label}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<RangeControl
					label={__('高さレベル', 'arkhe-blocks')}
					value={svgLevelBottom}
					onChange={(val) => {
						setAttributes({ svgLevelBottom: val });
					}}
					min={-100}
					max={100}
					step={1}
				/>
				<div className='components-base-control'>
					<div className='components-base-control__label'>
						{__('Color', 'arkhe-blocks')}
					</div>
					<WpColorPalette
						value={svgColorBottom}
						onChange={(color) => {
							setAttributes({ svgColorBottom: color });
						}}
						clearable={true}
					/>
				</div>
			</PanelBody>
		</InspectorControls>
	);
};
