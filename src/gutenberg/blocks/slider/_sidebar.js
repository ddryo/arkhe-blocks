/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	RadioControl,
	SelectControl,
} from '@wordpress/components';
// import { useDispatch } from '@wordpress/data';

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
		effect,
		speed,
		delay,
		space,
		slideNumPC,
		slideNumSP,
		isCenter,
		pagination,
		isClickable,
		isDynamic,
	} = attributes;

	// コンテンツの左右余白

	return (
		<>
			<PanelBody title={__('スライダーの高さ setting', 'arkhe-blocks')} initialOpen={true}>
				<RadioControl
					selected={height}
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
					}}
				/>
				{'custom' === height && (
					<>
						<TextControl
							label={__('Height', 'arkhe-blocks') + '(PC)'}
							// type='number'
							value={heightPC}
							autocomplete='off'
							onChange={(val) => {
								setAttributes({ heightPC: val });
							}}
						/>
						<TextControl
							label={__('Height', 'arkhe-blocks') + '(SP)'}
							// type='number'
							value={heightSP}
							autocomplete='off'
							onChange={(val) => {
								setAttributes({ heightPC: val });
							}}
						/>
					</>
				)}

				{/* <ToggleControl
					label={__('Make it scrollable', 'arkhe-blocks') + '(PC)'}
					checked={isScrollPC}
					onChange={(value) => {
						setAttributes({ isScrollPC: value });
					}}
				/> */}
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

				<RadioControl
					selected={effect}
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
						setAttributes({ effect: parseInt(val) });
					}}
				/>
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
				<TextControl
					label={__('Space', 'arkhe-blocks') + ' [px]'}
					type='number'
					value={space}
					step='1'
					min='0'
					autocomplete='off'
					onChange={(val) => {
						setAttributes({ space: parseFloat(val) });
					}}
				/>
				<TextControl
					label={__('Slide Num', 'arkhe-blocks') + ' (PC)'}
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
					label={__('Slide Num', 'arkhe-blocks') + ' (SP)'}
					type='number'
					value={slideNumSP}
					step='1'
					min='1'
					autocomplete='off'
					onChange={(val) => {
						setAttributes({ slideNumSP: parseFloat(val) });
					}}
				/>
				<div data-ark-disabled={(slideNumPC === 1 && slideNumSP === 1) || null}>
					<ToggleControl
						label={__('center', 'arkhe-blocks')}
						checked={isCenter}
						onChange={(value) => {
							setAttributes({ isCenter: value });
						}}
					/>
				</div>
			</PanelBody>
			<PanelBody title={__('Pagenation', 'arkhe-blocks')} initialOpen={false}>
				<SelectControl
					selected={pagination}
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
