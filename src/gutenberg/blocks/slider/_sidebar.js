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
									setOptions({ slideNumPC: parseFloat(val) });
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
									setOptions({ slideNumSP: parseFloat(val) });
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
				<div
					data-ark-disabled={
						(options.slideNumPC === 1 && options.slideNumSP === 1) || null
					}
				>
					<ToggleControl
						label={__('Center the slide', 'arkhe-blocks')}
						checked={options.isCenter}
						onChange={(val) => {
							setOptions({ isCenter: val });
						}}
					/>
				</div>
				<SelectControl
					label={__('Transition effect', 'arkhe-blocks')}
					value={options.effect}
					options={[
						{
							label: __('Slide', 'arkhe-blocks'),
							value: 'slide',
						},
						{
							label: __('Fade', 'arkhe-blocks'),
							value: 'fade',
						},
					]}
					onChange={(val) => {
						setOptions({ effect: val });
					}}
				/>
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
				{isRichSlider && (
					<div data-ark-disabled={'content' === height || null}>
						<SelectControl
							label={__('Slider direction', 'arkhe-blocks')}
							value={options.direction}
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
				)}
			</PanelBody>

			<PanelBody title={__('Pagination', 'arkhe-blocks')} initialOpen={true}>
				<SelectControl
					value={options.pagination}
					options={[
						{
							label: __('Off', 'arkhe-blocks'),
							value: 'off',
						},
						{
							label: __('Dots', 'arkhe-blocks'),
							value: 'bullets',
						},
						{
							label: __('Fraction', 'arkhe-blocks'),
							value: 'fraction',
						},
						{
							label: __('Progressbar', 'arkhe-blocks'),
							value: 'progressbar',
						},
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
						label={__('Clickable', 'arkhe-blocks')}
						checked={options.isClickable}
						onChange={(value) => {
							setOptions({ isClickable: value });
						}}
						className='arkb-ctrl--mb--s'
					/>
					<ToggleControl
						label={__('DynamicBullets', 'arkhe-blocks')}
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
				help={__('矢印ボタンやページネーションの色が変わります', 'arkhe-blocks')}
			>
				<div className='description'>
					{__('矢印ボタンやページネーションの色が変わります', 'arkhe-blocks')}
				</div>
			</PanelColorSettings>
		</>
	);
};
