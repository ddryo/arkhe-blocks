/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	// RadioControl,
	SelectControl,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import { PanelColorSettings } from '@wordpress/block-editor';
// import { useState } from '@wordpress/element';
// import { useDispatch } from '@wordpress/data';
import { Icon, mobile, desktop } from '@wordpress/icons';

/**
 * @Inner dependencies
 */
import { effectOptions } from './_options';
import { UnitNumber } from '@components/UnitNumber';
import { ArkDeviceTab } from '@components/ArkDeviceTab';

/**
 * sidebar
 */
export default ({ attributes, setAttributes }) => {
	const { variation, height, heightPC, heightSP, options, slideColor } = attributes;

	const setOptions = (newOptions) => {
		setAttributes({ options: { ...options, ...newOptions } });
	};

	// Richスライダーかどうか
	const isRichSlider = 'rich' === variation;

	// 複数スライドかどうか
	const isMultiple = !(options.slideNumPC === 1 && options.slideNumSP === 1);

	return (
		<>
			{isRichSlider && (
				<PanelBody
					title={__('Slider height', 'arkhe-blocks')}
					className='arkb-panel--slideHeight'
					initialOpen={true}
				>
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
							if ('content' === val) {
								setOptions({ direction: 'horizontal' });
							}
						}}
					/>
					<div
						data-ark-disabled={'custom' !== height || null}
						style={{ marginTop: '16px' }}
					>
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
			)}
			<PanelBody
				title={__('Settings for each device', 'arkhe-blocks')}
				className='arkb-panel--slideHeight'
				initialOpen={true}
			>
				<ArkDeviceTab
					controlPC={
						<>
							<TextControl
								label={__('Number of slides', 'arkhe-blocks')}
								type='number'
								value={options.slideNumPC}
								step='1'
								min='1'
								autocomplete='off'
								onChange={(val) => {
									const floatVal = parseFloat(val);
									setOptions({ slideNumPC: floatVal });
								}}
							/>
							<TextControl
								label={__('Space between slides', 'arkhe-blocks') + ' [px]'}
								type='number'
								value={options.spacePC}
								step='1'
								min='0'
								autocomplete='off'
								onChange={(val) => {
									setOptions({ spacePC: parseFloat(val) });
								}}
							/>
						</>
					}
					controlSP={
						<>
							<TextControl
								label={__('Number of slides', 'arkhe-blocks')}
								type='number'
								value={options.slideNumSP}
								step='1'
								min='1'
								autocomplete='off'
								onChange={(val) => {
									const floatVal = parseFloat(val);
									setOptions({ slideNumSP: floatVal });
								}}
							/>
							<TextControl
								label={__('Space between slides', 'arkhe-blocks') + ' [px]'}
								type='number'
								value={options.spaceSP}
								step='1'
								min='0'
								autocomplete='off'
								onChange={(val) => {
									setOptions({ spaceSP: parseFloat(val) });
								}}
							/>
						</>
					}
				/>
			</PanelBody>
			<PanelBody title={__('Slider settings', 'arkhe-blocks')} initialOpen={true}>
				{/* <BaseControl className='arkb-toggles'> */}
				<ToggleControl
					label={__('Enable autoplay', 'arkhe-blocks')}
					checked={options.isAuto}
					onChange={(val) => {
						setOptions({ isAuto: val });
					}}
					className='arkb-ctrl--mb--s'
				/>
				<ToggleControl
					label={__('Enable loop', 'arkhe-blocks')}
					checked={options.isLoop}
					onChange={(val) => {
						setOptions({ isLoop: val });
					}}
					className='arkb-ctrl--mb--s'
				/>
				<ToggleControl
					label={__('Show arrow navigation', 'arkhe-blocks')}
					checked={options.showArrow}
					onChange={(val) => {
						setOptions({ showArrow: val });
					}}
					className='arkb-ctrl--mb--s'
				/>
				<div data-ark-disabled={!isMultiple || null}>
					<ToggleControl
						label={__('Center the slide', 'arkhe-blocks')}
						checked={options.isCenter}
						onChange={(val) => {
							setOptions({ isCenter: val });
						}}
					/>
				</div>
				<TextControl
					label={__('Slide transition time', 'arkhe-blocks') + ' [ms]'}
					type='number'
					value={options.speed}
					step='100'
					min='0'
					autocomplete='off'
					onChange={(val) => {
						setOptions({ speed: parseInt(val) });
					}}
				/>
				<TextControl
					data-ark-disabled={!options.isAuto || null}
					label={__('Delay time between transitions', 'arkhe-blocks') + ' [ms]'}
					type='number'
					value={options.delay}
					step='100'
					min='0'
					autocomplete='off'
					onChange={(val) => {
						setOptions({ delay: parseInt(val) });
					}}
				/>
				<SelectControl
					label={_x('Transition effect', 'slider', 'arkhe-blocks')}
					value={options.effect}
					help={__(
						'When you select Fade/Flip/Cube, the number of slides displayed will be set to 1.',
						'arkhe-blocks'
					)}
					options={[
						{
							label: effectOptions.slide,
							value: 'slide',
						},
						{
							label: effectOptions.fade,
							value: 'fade',
						},
						{
							label: effectOptions.flip,
							value: 'flip',
						},
						{
							label: effectOptions.cube,
							value: 'cube',
						},
						{
							label: effectOptions.coverflow,
							value: 'coverflow',
						},
					]}
					onChange={(val) => {
						const isSingleEffect = 'fade' === val || 'flip' === val || 'cube' === val;
						setOptions({
							effect: val,
							...(isSingleEffect ? { slideNumPC: 1, slideNumSP: 1 } : {}),
						});
					}}
				/>
			</PanelBody>
			{!isRichSlider && (
				<PanelBody title={__('Media Slider settings', 'arkhe-blocks')} initialOpen={true}>
					<ToggleControl
						label={__('Show thumbnail slider', 'arkhe-blocks')}
						checked={options.showThumb}
						onChange={(val) => {
							setOptions({ showThumb: val });
						}}
					/>
				</PanelBody>
			)}
			{isRichSlider && (
				<PanelBody title={__('Rich Slider settings', 'arkhe-blocks')} initialOpen={true}>
					<div data-ark-disabled={'content' === height || null}>
						<SelectControl
							label={__('Slider direction', 'arkhe-blocks')}
							value={options.direction}
							help={
								'content' === height
									? __(
											'This function is not available when the slider height setting is "Fit to Content".',
											'arkhe-blocks'
									  )
									: null
							}
							options={[
								{
									label: _x('Horizontal', 'slider', 'arkhe-blocks'),
									value: 'horizontal',
								},
								{
									label: _x('Vertical', 'slider', 'arkhe-blocks'),
									value: 'vertical',
								},
							]}
							onChange={(val) => {
								setOptions({ direction: val });
							}}
						/>
					</div>
				</PanelBody>
			)}
			<PanelBody title={__('Pagination', 'arkhe-blocks')} initialOpen={true}>
				<SelectControl
					value={options.pagination}
					options={[
						{
							label: _x('Off', 'slider', 'arkhe-blocks'),
							value: 'off',
						},
						{
							label: _x('Bullets', 'slider', 'arkhe-blocks'),
							value: 'bullets',
						},
						{
							label: _x('Progressbar', 'slider', 'arkhe-blocks'),
							value: 'progressbar',
						},
						{
							label: _x('Fraction', 'slider', 'arkhe-blocks'),
							value: 'fraction',
						},
						// {
						// 	label: _x('Scrollbar', 'slider', 'arkhe-blocks'),
						// 	value: 'scrollbar',
						// },
					]}
					onChange={(val) => {
						const newOptions = { pagination: val };
						if ('bullets' !== val) {
							newOptions.isClickable = false;
							newOptions.isDynamic = false;
						}
						setOptions(newOptions);
					}}
				/>
				<div data-ark-disabled={'bullets' !== options.pagination || null}>
					<ToggleControl
						label={_x('Clickable', 'slider', 'arkhe-blocks')}
						checked={options.isClickable}
						onChange={(value) => {
							setOptions({ isClickable: value });
						}}
						className='arkb-ctrl--mb--xs'
					/>
					<ToggleControl
						label={_x('DynamicBullets', 'slider', 'arkhe-blocks')}
						checked={options.isDynamic}
						onChange={(value) => {
							setOptions({ isDynamic: value });
						}}
					/>
				</div>
			</PanelBody>
			<PanelColorSettings
				title={__('Navigation Color', 'arkhe-blocks')}
				initialOpen={true}
				colorSettings={[
					{
						value: slideColor,
						label: __('Color', 'arkhe-blocks'),
						onChange: (value) => {
							setAttributes({ slideColor: value });
						},
					},
				]}
			>
				<div className='description'>
					{__(
						'The color of the arrow buttons and pagination will change.',
						'arkhe-blocks'
					)}
				</div>
			</PanelColorSettings>
		</>
	);
};
