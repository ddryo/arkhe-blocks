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
	// TextControl,
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
		media,
		mediaSP,
		focalPoint,
		focalPointSP,
		isRepeat,
		bgSize,
		opacity,
		bgColor,
		bgGradient,
		textColor,
		filter,
		height,
		heightPC,
		heightSP,
		paddingPC,
		paddingSP,
		svgTop,
		svgBottom,
	} = attributes;

	const mediaUrl = media.url;

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

	// ブロック選択時の初回の状態を記憶
	const isOpenSvgTop = useMemo(() => {
		return 0 !== svgTop.level;
	}, [isSelected]);
	const isOpenSvgBottom = useMemo(() => {
		return 0 !== svgBottom.level;
	}, [isSelected]);

	return (
		<>
			<PanelBody title={__('Background media setting', 'arkhe-blocks')} className='aaa'>
				{isRepeat && mediaUrl && (
					<div className='arkb-imgPreview'>
						<img src={mediaUrl} alt='' />
					</div>
				)}
				<ImageTab
					{...{
						media,
						mediaSP,
						focalPoint,
						focalPointSP,
						isRepeat,
						opacity,
						bgSize,
						setAttributes,
					}}
				/>
				<ToggleControl
					// フィルター設定。あとで数を増やせるように bool ではなく string で管理。
					label={__('Apply a dot filter', 'arkhe-blocks')}
					checked={'dot' === filter}
					onChange={(val) => {
						if (val) {
							setAttributes({ filter: 'dot' });
						} else {
							setAttributes({ filter: 'off' });
						}
					}}
					className='arkb-ctrl--mt--s arkb-ctrl--mb--xs'
					help={
						!window.arkbVars.isArkhe
							? __('This is only available when the theme is Arkhe.', 'arkhe-blocks')
							: null
					}
				/>
				<ToggleControl
					label={__('Repeat the background image', 'arkhe-blocks')}
					checked={isRepeat}
					onChange={(val) => {
						setAttributes({ isRepeat: val });
						if (val) {
							setAttributes({ focalPoint: undefined });
						}
					}}
					className='arkb-ctrl--mb--xs'
				/>
				{isRepeat && (
					<Flex style={{ margin: '0 0 16px' }}>
						<FlexItem>{__('Background Size', 'arkhe-blocks')} : </FlexItem>
						<FlexBlock>
							<UnitNumber
								value={bgSize}
								onChange={(newVal) => {
									setAttributes({ bgSize: newVal });
								}}
							/>
						</FlexBlock>
					</Flex>
				)}
			</PanelBody>
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
							label: __('Specify by number', 'arkhe-blocks'),
							value: 'custom',
						},
					]}
					onChange={(val) => {
						setAttributes({ height: val });
					}}
				/>
				<div data-ark-disabled={'custom' !== height || null} style={{ marginTop: '16px' }}>
					<Flex>
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
					<Flex style={{ marginTop: '8px' }}>
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

			<PanelBody title={__('Top border', 'arkhe-blocks')} initialOpen={isOpenSvgTop}>
				<BaseControl>
					<BaseControl.VisualLabel>{__('Shape', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns--svg -top'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type !== svgTop.type}
									isPrimary={type === svgTop.type}
									onClick={() => {
										setAttributes({ svgTop: { ...svgTop, type } });
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
					value={svgTop.level}
					onChange={(level) => {
						setAttributes({ svgTop: { ...svgTop, level } });
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
						value={svgTop.color}
						onChange={(color) => {
							setAttributes({ svgTop: { ...svgTop, color } });
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
									isSecondary={type !== svgBottom.type}
									isPrimary={type === svgBottom.type}
									onClick={() => {
										setAttributes({ svgBottom: { ...svgBottom, type } });
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
					value={svgBottom.level}
					onChange={(level) => {
						setAttributes({ svgBottom: { ...svgBottom, level } });
					}}
					min={-100}
					max={100}
					step={1}
				/>
				<BaseControl>
					<BaseControl.VisualLabel>{__('Color', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<WpColorPalette
						value={svgBottom.color}
						onChange={(color) => {
							setAttributes({ svgBottom: { ...svgBottom, color } });
						}}
						clearable={true}
					/>
				</BaseControl>
			</PanelBody>
		</>
	);
};
