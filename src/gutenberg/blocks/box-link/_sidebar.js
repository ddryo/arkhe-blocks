/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import {
	PanelBody,
	TextControl,
	BaseControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
	TextareaControl,
	ColorPalette,
} from '@wordpress/components';

/**
 * @Internal dependencies
 */
import blockIcon from './_icon';
import getNewLinkRel from '@helper/getNewLinkRel';
import ArkheIconPicker from '@components/ArkheIconPicker';
import { ImageSizeSelect } from '@components/ImageSizeSelect';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * 設定データ
 */
const layoutBtns = [
	{
		value: 'vertical',
		label: __('Vertical', 'arkhe-blocks'),
	},
	{
		value: 'horizontal',
		label: __('Horizontal', 'arkhe-blocks'),
	},
];

// タイトル部分のタグの選択肢
const hTags = [
	{
		label: 'h2',
		val: 'h2',
	},
	{
		label: 'h3',
		val: 'h3',
	},
	{
		label: 'h4',
		val: 'h4',
	},
	{
		label: 'div',
		val: 'div',
	},
];

const iconColorSet = [
	{
		name: __('White', 'arkhe-blocks'),
		color: '#fff',
	},
	{
		name: __('Black', 'arkhe-blocks'),
		color: '#000',
	},
];

/**
 * コンポーネント
 */
export default (props) => {
	const {
		attributes,
		isBannerStyle,
		setAttributes,
		updateImageSize,
		// sizeOptions,
		useIconHtml,
		setUseIconHtml,
	} = props;

	const {
		useIcon,
		iconHtml,
		icon,
		iconSize,
		iconColor,
		layout,
		imgId,
		imgUrl,
		imgSize,
		fixRatio,
		isContain,
		ratio,
		htag,
		rel,
		isNewTab,
		more,
		showMoreArrow,
		opacity,
	} = attributes;

	// 縦並びか横並びかを変数化
	const isVertical = 'vertical' === layout;

	// 画像比率の設定
	const rationHelp = isVertical
		? __('By default, it has the same ratio as thumbnails in the archive list.', 'arkhe-blocks')
		: null;

	let ratioSettings = null;
	// if (!isBannerStyle) {
	ratioSettings = (
		<div data-ark-disabled={isBannerStyle || null}>
			{isVertical && (
				<ToggleControl
					label={__('Fix image ratio', 'arkhe-blocks')}
					checked={fixRatio}
					onChange={(val) => {
						setAttributes({ fixRatio: val });
						if (!val) {
							setAttributes({ ratio: undefined });
						}
					}}
				/>
			)}
			{(!isVertical || fixRatio) && (
				<>
					<ToggleControl
						label={__('Show the entire image', 'arkhe-blocks')}
						// help={<code className='u-fz-n'>object-fit: contain;</code>}
						checked={isContain}
						onChange={(val) => {
							setAttributes({ isContain: val });
						}}
					/>
					<RangeControl
						label={__('Image ratio', 'arkhe-blocks')}
						help={rationHelp}
						value={ratio}
						onChange={(val) => {
							setAttributes({ ratio: val });
						}}
						min={1}
						max={100}
						allowReset={true}
						className='arkb-range--useReset'
					/>
				</>
			)}
		</div>
	);
	// }

	// アイコン選択時
	const setIcon = useCallback((val, isSelected) => {
		const newIcon = isSelected ? '' : val;
		setAttributes({ icon: newIcon });
	}, []);

	return (
		<>
			<PanelBody title={__('Box Settings', 'arkhe-blocks')} initialOpen={true}>
				<BaseControl>
					<BaseControl.VisualLabel>
						{__('Layout', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns--boxLayout'>
						{layoutBtns.map((btn) => {
							const btnVal = btn.value;
							return (
								<Button
									isPrimary={layout === btnVal}
									icon={blockIcon[btnVal]}
									key={`ark-${btnVal}`}
									onClick={() => {
										setAttributes({
											layout: btnVal,
											ratio: undefined, // リセット
											fixRatio: false, // リセット
											textAlign: '', // リセット
										});
									}}
								>
									<span>{btn.label}</span>
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<BaseControl>
					<BaseControl.VisualLabel>
						{__('HTML tag for title', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<ButtonGroup>
						{hTags.map((btn) => {
							const isSlected = btn.val === htag;
							return (
								<Button
									// isSecondary={ ! isSlected }
									isPrimary={isSlected}
									onClick={() => {
										setAttributes({ htag: btn.val });
									}}
									key={`htag_${btn.val}`}
								>
									{btn.label}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				{isBannerStyle && (
					<RangeControl
						label={__('Overlay opacity', 'arkhe-blocks')}
						value={opacity}
						onChange={(val) => {
							setAttributes({ opacity: val });
						}}
						min={0}
						max={100}
					/>
				)}
				<TextControl
					label={__('"READ MORE" text', 'arkhe-blocks')}
					// help={faNote}
					value={more}
					onChange={(val) => {
						setAttributes({ more: val });
					}}
				/>
				<div data-ark-disabled={'' === more || null}>
					<ToggleControl
						label={__('Show arrow icon', 'arkhe-blocks')}
						checked={showMoreArrow}
						onChange={(val) => {
							setAttributes({ showMoreArrow: val });
						}}
					/>
				</div>
			</PanelBody>
			{imgUrl && (
				<PanelBody title={__('Image settings', 'arkhe-blocks')} initialOpen={true}>
					{ratioSettings}
					{0 !== imgId && <ImageSizeSelect {...{ imgId, imgSize, updateImageSize }} />}
				</PanelBody>
			)}

			<PanelBody title={__('Icon settings', 'arkhe-blocks')} initialOpen={true}>
				<ToggleControl
					label={__('Use icon', 'arkhe-blocks')}
					checked={useIcon}
					onChange={(val) => {
						setAttributes({ useIcon: val });
					}}
				/>
				{useIcon && (
					<>
						<ToggleControl
							label={__('Write the icon in HTML', 'arkhe-blocks')}
							className='arkb-toggle--iconHtml'
							checked={useIconHtml}
							onChange={(val) => {
								setUseIconHtml(val);
								if (!val) {
									setAttributes({ iconHtml: undefined });
								}
							}}
						/>
						{useIconHtml ? (
							<TextareaControl
								label={__('HTML for icons', 'arkhe-blocks')}
								help='svgタグまたはiタグを使用してください。'
								value={iconHtml}
								rows='8'
								onChange={(val) => {
									setAttributes({ iconHtml: val });
								}}
							/>
						) : (
							<ArkheIconPicker icon={icon} setIcon={setIcon} />
						)}
						<BaseControl>
							<BaseControl.VisualLabel>
								{__('Icon color', 'arkhe-blocks')}
							</BaseControl.VisualLabel>
							<ColorPalette
								value={iconColor}
								colors={iconColorSet}
								onChange={(val) => {
									setAttributes({ iconColor: val });
								}}
							/>
						</BaseControl>
						<RangeControl
							label={__('Icon size', 'arkhe-blocks')}
							value={iconSize}
							onChange={(val) => {
								setAttributes({ iconSize: val });
							}}
							min={10}
							max={240}
							allowReset={true}
							className='arkb-range--useReset'
						/>
					</>
				)}
			</PanelBody>
			<PanelBody title={__('Link settings', 'arkhe-blocks')} initialOpen={true}>
				<ToggleControl
					label={__('Open in new tab')}
					checked={isNewTab}
					onChange={(value) => {
						const newRel = getNewLinkRel(value, rel);
						setAttributes({
							isNewTab: value,
							rel: newRel,
						});
					}}
				/>
				<TextControl
					label={__('Link rel')}
					value={rel || ''}
					onChange={(value) => {
						setAttributes({ rel: value });
					}}
				/>
			</PanelBody>
		</>
	);
};
