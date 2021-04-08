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
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';

import { useMemo, useCallback } from '@wordpress/element';
import { Icon, mobile, desktop } from '@wordpress/icons';

/**
 * @Inner dependencies
 */
import { ImageTab } from './components/ImageTab';
import { getButtonSVG } from './components/SectionSVG';
import { UnitNumber } from '@components/UnitNumber';
import { ArkDeviceTab } from '@components/ArkDeviceTab';
import { PaddingControl } from '@components/PaddingControl';

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

const svgTypes = ['line', 'circle', 'wave', 'zigzag'];

export default ({ attributes, setAttributes, isSelected }) => {
	const {
		// align,
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
		height,
		heightPC,
		heightSP,
		// heightUnitPC,
		// heightUnitSP,
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
		isFullscreen,
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

	// 初回の状態を記憶
	const isOpenSvgTop = useMemo(() => {
		// console.log('memo: isOpenSvgTop');
		return 0 !== svgLevelTop;
	}, [isSelected]);
	const isOpenSvgBottom = useMemo(() => {
		return 0 !== svgLevelBottom;
	}, [isSelected]);

	return (
		<>
			<PanelBody title={__('Height settings', 'arkhe-blocks')}>
				<SelectControl
					value={height}
					options={[
						{
							label: __('Fit to content', 'arkhe-blocks'),
							value: 'content',
						},
						{
							label: __('Fit screen', 'arkhe-blocks'),
							value: 'full',
						},
						{
							label: __('数値で指定', 'arkhe-blocks'),
							value: 'custom',
						},
					]}
					onChange={(val) => {
						setAttributes({ height: val });
					}}
				/>
				<div data-ark-disabled={'custom' !== height || null} style={{ marginTop: '16px' }}>
					<Flex className=''>
						<FlexItem style={{ marginRight: '4px' }}>
							<Icon icon={desktop} />
						</FlexItem>
						<FlexItem style={{ width: '2em' }}>PC</FlexItem>
						<FlexBlock>
							<UnitNumber
								value={heightPC}
								onChange={(newVal) => {
									setAttributes({ heightPC: newVal });
								}}
							/>
						</FlexBlock>
					</Flex>
					<Flex className='' style={{ marginTop: '8px' }}>
						<FlexItem style={{ marginRight: '4px' }}>
							<Icon icon={mobile} />
						</FlexItem>
						<FlexItem style={{ width: '2em' }}>SP</FlexItem>
						<FlexBlock>
							<UnitNumber
								value={heightSP}
								onChange={(newVal) => {
									setAttributes({ heightSP: newVal });
								}}
							/>
						</FlexBlock>
					</Flex>
				</div>
			</PanelBody>
			<PanelBody title={__('Padding settings', 'arkhe-blocks')}>
				<ArkDeviceTab
					className='-padding'
					controlPC={
						<>
							<PaddingControl
								name='padPC'
								value={padPC}
								setAttributes={setAttributes}
							/>
						</>
					}
					controlSP={
						<>
							<PaddingControl
								name='padSP'
								value={padSP}
								setAttributes={setAttributes}
							/>
						</>
					}
				/>

				{/* <div className='ark-control--padding'>
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
				</div> */}
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
				<BaseControl>
					<BaseControl.VisualLabel>{__('Color', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<WpColorPalette
						value={svgColorBottom}
						onChange={(color) => {
							setAttributes({ svgColorBottom: color });
						}}
						clearable={true}
					/>
				</BaseControl>
			</PanelBody>
		</>
	);
};
