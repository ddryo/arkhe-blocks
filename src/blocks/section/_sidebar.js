/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	ColorPalette as WpColorPalette,
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

import { memo, useMemo } from '@wordpress/element';

/**
 * @Inner dependencies
 */
import { ImageTab } from './components/ImageTab';
import { getButtonSVG } from './components/SectionSVG';

/**
 * 設定
 */
const padUnits = ['px', 'rem', 'em', '%', 'vw', 'vh'];

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

const svgTypes = ['line', 'circle', 'wave', 'zigzag'];

export default memo(({ attributes, setAttributes, isSelected }) => {
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
		svgLevelTop,
		svgLevelBottom,
		svgTypeTop,
		svgTypeBottom,
		svgColorTop,
		svgColorBottom,
	} = attributes;

	// 画像設定タブに渡す情報
	const mediaProps = {
		mediaId,
		mediaUrl,
		mediaIdSP,
		mediaUrlSP,
		focalPoint,
		focalPointSP,
		isRepeat,
		opacity,
		setAttributes,
	};

	// 初回の状態を記憶
	const isOpenSvgTop = useMemo(() => {
		// console.log('memo: isOpenSvgTop');
		return 0 !== svgLevelTop;
	}, [isSelected]);
	const isOpenSvgBottom = useMemo(() => {
		return 0 !== svgLevelBottom;
	}, [isSelected]);

	// useEffect(() => {
	// 	console.log('useEffect !');
	// }, [isSelected]);

	// console.log('InspectorControls');

	return (
		<InspectorControls>
			<PanelBody title={__('Padding settings', 'arkhe-blocks')}>
				<div className='ark-control--padding'>
					<div className='__label'>
						{__('Upper and lower padding amount', 'arkhe-blocks') + '(PC)'}
					</div>
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
					<div className='__label'>
						{__('Upper and lower padding amount', 'arkhe-blocks') + '(SP)'}
					</div>
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
				<BaseControl>
					<BaseControl.VisualLabel>
						{mediaUrl
							? __('Overlay color', 'arkhe-blocks')
							: __('Background color', 'arkhe-blocks')}
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
			</PanelBody>
			<PanelBody title={__('Background media setting', 'arkhe-blocks')}>
				{isRepeat && mediaUrl && (
					<div className='arkb-imgPreview'>
						<img src={mediaUrl} alt='' />
					</div>
				)}
				<ImageTab {...mediaProps} />
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
			<PanelBody title={__('Top border', 'arkhe-blocks')} initialOpen={isOpenSvgTop}>
				<BaseControl>
					<BaseControl.VisualLabel>{__('Shape', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns--svg -top'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type !== svgTypeTop}
									isPrimary={type === svgTypeTop}
									onClick={() => {
										setAttributes({ svgTypeTop: type });
									}}
									key={`key_${type}`}
								>
									{getButtonSVG(type)}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<RangeControl
					label={__('Height level', 'arkhe-blocks')}
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
			<PanelBody title={__('Bottom border', 'arkhe-blocks')} initialOpen={isOpenSvgBottom}>
				<BaseControl>
					<BaseControl.VisualLabel>{__('Shape', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns--svg -bottom'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type !== svgTypeBottom}
									isPrimary={type === svgTypeBottom}
									onClick={() => {
										setAttributes({ svgTypeBottom: type });
									}}
									key={`key_${type}`}
								>
									{getButtonSVG(type)}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<RangeControl
					label={__('Height level', 'arkhe-blocks')}
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
});
