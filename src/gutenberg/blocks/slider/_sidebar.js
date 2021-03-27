/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	RadioControl,
	SelectControl,
} from '@wordpress/components';
// import { useState } from '@wordpress/element';
// import { useDispatch } from '@wordpress/data';

/**
 * @Inner dependencies
 */
import { UnitNumber } from '@components/UnitNumber';
import { ArkDeviceTab } from '@components/ArkDeviceTab';

/**
 * sidebar
 */
export default ({ attributes, setAttributes, clientId }) => {
	const {
		height,
		heightPC,
		heightSP,
		isAuto,
		isLoop,
		showNavigation,
		effect,
		speed,
		delay,
		spacePC,
		spaceSP,
		direction,
		slideNumPC,
		slideNumSP,
		isCenter,
		pagination,
		isClickable,
		isDynamic,
	} = attributes;

	return (
		<>
			<PanelBody
				title={__('スライダーの高さ setting', 'arkhe-blocks')}
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
						// {
						// 	label: __('Fit to media', 'arkhe-blocks'),
						// 	value: 'media',
						// },
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
						if ('content' === val) {
							setAttributes({ direction: 'horizontal' });
						}
					}}
				/>
				<div data-ark-disabled={'custom' !== height || null}>
					<ArkDeviceTab
						controlPC={
							<UnitNumber
								// label={__('Height', 'arkhe-blocks')}
								value={heightPC}
								onChange={(newVal) => {
									setAttributes({ heightPC: newVal });
								}}
							/>
						}
						controlSP={
							<UnitNumber
								// label={__('Height', 'arkhe-blocks')}
								value={heightSP}
								onChange={(newVal) => {
									setAttributes({ heightSP: newVal });
								}}
							/>
						}
					/>
				</div>
			</PanelBody>
			<PanelBody title={__('スライダー機能', 'arkhe-blocks')} initialOpen={true}>
				<ToggleControl
					label={__('auto', 'arkhe-blocks')}
					checked={isAuto}
					onChange={(value) => {
						setAttributes({ isAuto: value });
					}}
				/>
				<ToggleControl
					label={__('loop', 'arkhe-blocks')}
					checked={isLoop}
					onChange={(value) => {
						setAttributes({ isLoop: value });
					}}
				/>
				<ToggleControl
					label={__('Show navigation', 'arkhe-blocks')}
					checked={showNavigation}
					onChange={(value) => {
						setAttributes({ showNavigation: value });
					}}
				/>

				<SelectControl
					label={__('Slider effect', 'arkhe-blocks')}
					value={effect}
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
						setAttributes({ effect: val });
					}}
				/>
				<div data-ark-disabled={'content' === height || null}>
					<SelectControl
						label={__('Slider direction', 'arkhe-blocks')}
						value={direction}
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
							setAttributes({ direction: val });
						}}
					/>
				</div>
				<TextControl
					label={__('Slide speed', 'arkhe-blocks') + ' [ms]'}
					type='number'
					value={speed}
					step='100'
					min='0'
					autocomplete='off'
					onChange={(val) => {
						setAttributes({ speed: parseInt(val) });
					}}
				/>
				<TextControl
					label={__('Switching interval', 'arkhe-blocks') + ' [ms]'}
					type='number'
					value={delay}
					step='100'
					min='0'
					autocomplete='off'
					onChange={(val) => {
						setAttributes({ delay: parseInt(val) });
					}}
				/>
				<div data-ark-disabled={(slideNumPC === 1 && slideNumSP === 1) || null}>
					<ToggleControl
						label={__('表示枚数が複数の時、センターに寄せる', 'arkhe-blocks')}
						checked={isCenter}
						onChange={(value) => {
							setAttributes({ isCenter: value });
						}}
					/>
				</div>
			</PanelBody>
			<PanelBody
				title={__('デバイスごとの設定', 'arkhe-blocks')}
				className='arkb-panel--slideHeight'
				initialOpen={true}
			>
				<ArkDeviceTab
					controlPC={
						<>
							<TextControl
								label={__('Slide Num', 'arkhe-blocks')}
								type='number'
								value={slideNumPC}
								step='1'
								min='1'
								autocomplete='off'
								onChange={(val) => {
									setAttributes({ slideNumPC: parseFloat(val) });
								}}
							/>
							<TextControl
								label={__('Space', 'arkhe-blocks') + ' [px]'}
								type='number'
								value={spacePC}
								step='1'
								min='0'
								autocomplete='off'
								onChange={(val) => {
									setAttributes({ spacePC: parseFloat(val) });
								}}
							/>
						</>
					}
					controlSP={
						<>
							<TextControl
								label={__('Slide Num', 'arkhe-blocks')}
								type='number'
								value={slideNumSP}
								step='1'
								min='1'
								autocomplete='off'
								onChange={(val) => {
									setAttributes({ slideNumSP: parseFloat(val) });
								}}
							/>
							<TextControl
								label={__('Space', 'arkhe-blocks') + ' [px]'}
								type='number'
								value={spaceSP}
								step='1'
								min='0'
								autocomplete='off'
								onChange={(val) => {
									setAttributes({ spaceSP: parseFloat(val) });
								}}
							/>
						</>
					}
				/>
			</PanelBody>
			<PanelBody title={__('Pagenation', 'arkhe-blocks')} initialOpen={true}>
				<SelectControl
					value={pagination}
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
						// {
						// 	label: __('Custom', 'arkhe-blocks'),
						// 	value: 'custom',
						// },
					]}
					onChange={(val) => {
						setAttributes({ pagination: val });
						if ('bullets' !== val) {
							setAttributes({ clickable: false, dynamicBullets: false });
						}
					}}
				/>
				{'bullets' === pagination && (
					<>
						<ToggleControl
							label={__('Clickable', 'arkhe-blocks')}
							checked={isClickable}
							onChange={(value) => {
								setAttributes({ isClickable: value });
							}}
						/>
						<ToggleControl
							label={__('DynamicBullets', 'arkhe-blocks')}
							checked={isDynamic}
							onChange={(value) => {
								setAttributes({ isDynamic: value });
							}}
						/>
					</>
				)}
			</PanelBody>
		</>
	);
};
