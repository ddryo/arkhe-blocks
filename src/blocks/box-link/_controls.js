/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useCallback } from '@wordpress/element';
// import { useSelect } from '@wordpress/data';
import {
	BlockControls,
	InspectorControls,
	// AlignmentToolbar,
	MediaReplaceFlow,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	BaseControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
	ToolbarButton,
	ToolbarGroup,
	TextareaControl,
	Popover,
} from '@wordpress/components';
import { Icon, alignCenter, link } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import blockIcon from './_icon';
import ArkheIconPicker from '@components/ArkheIconPicker';
import getNewLinkRel from '@helper/getNewLinkRel';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

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

/**
 * コンポーネント
 */
export default memo((props) => {
	const {
		attributes,
		isBannerStyle,
		setAttributes,
		onSelectImage,
		onSelectURL,
		onRemoveImage,
		updateImagesSize,
		sizeOptions,
		isURLPickerOpen,
		setIsURLPickerOpen,
		useIconHtml,
		setUseIconHtml,
	} = props;

	const {
		textAlign,
		useIcon,
		iconHtml,
		icon,
		iconSize,
		layout,
		imgId,
		imgUrl,
		// imgAlt,
		imgSize,
		fixRatio,
		ratio,
		htag,
		href,
		rel,
		isNewTab,
		more,
		showMoreArrow,
	} = attributes;

	// 縦並びか横並びかを変数化
	const isVertical = 'vertical' === layout;

	// 画像比率の設定
	const rationHelp = isVertical
		? __('By default, it has the same ratio as thumbnails in the archive list.', 'arkhe-blocks')
		: null;

	let ratioSettings = null;
	if (!isBannerStyle) {
		ratioSettings = (
			<>
				{isVertical && (
					<ToggleControl
						label={__('Fix image ratio', 'arkhe-blocks')}
						checked={fixRatio}
						onChange={(val) => {
							setAttributes({ fixRatio: val });
						}}
					/>
				)}

				{(!isVertical || fixRatio) && (
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
				)}
			</>
		);
	}

	// アイコン選択時
	const setIcon = useCallback((val, isSelected) => {
		const newIcon = isSelected ? '' : val;
		setAttributes({ icon: newIcon });
	}, []);

	return (
		<>
			<BlockControls>
				{isVertical && (
					<ToolbarGroup>
						<ToolbarButton
							className={classnames('components-toolbar__control', {
								'is-pressed': 'center' === textAlign,
							})}
							label={__('Center the text', 'arkhe-blocks')}
							icon={<Icon icon={alignCenter} />}
							onClick={() => {
								const newAlign = 'center' === textAlign ? '' : 'center';
								setAttributes({ textAlign: newAlign });
							}}
						/>
					</ToolbarGroup>
				)}

				<ToolbarGroup>
					<ToolbarButton
						name='link'
						icon={<Icon icon={link} />}
						title={__('Link')}
						onClick={() => {
							setIsURLPickerOpen(true);
						}}
					/>
				</ToolbarGroup>
				{/* リンク設定用のポップオーバー */}
				{isURLPickerOpen && (
					<Popover position='bottom center' onClose={() => setIsURLPickerOpen(false)}>
						<LinkControl
							className='wp-block-navigation-link__inline-link-input'
							value={{ url: href, opensInNewTab: isNewTab }}
							onChange={(changedVal) => {
								// console.log(changedVal);
								const { url = '', opensInNewTab } = changedVal;
								const newRel = getNewLinkRel(opensInNewTab, rel);

								setAttributes({
									href: url,
									isNewTab: opensInNewTab,
									rel: newRel,
								});
							}}
						/>
					</Popover>
				)}
				{!!imgUrl && (
					<>
						<MediaReplaceFlow
							mediaId={imgId}
							mediaURL={imgUrl}
							allowedTypes={['image']}
							accept='image/*'
							onSelect={onSelectImage}
							onSelectURL={onSelectURL}
						/>
						<ToolbarGroup>
							<ToolbarButton
								className='components-toolbar__control'
								label={__('Delete image', 'arkhe-blocks')}
								icon='no-alt'
								// icon={<Icon icon={cancelCircleFilled} />}
								onClick={onRemoveImage}
							/>
						</ToolbarGroup>
					</>
				)}
			</BlockControls>

			<InspectorControls>
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
					<TextControl
						label={__('"READ MORE" text', 'arkhe-blocks')}
						// help={faNote}
						value={more}
						onChange={(val) => {
							setAttributes({ more: val });
						}}
					/>
					<ToggleControl
						label={__('Show arrow icon', 'arkhe-blocks')}
						checked={showMoreArrow}
						onChange={(val) => {
							setAttributes({ showMoreArrow: val });
						}}
					/>
				</PanelBody>
				<PanelBody title={__('Image settings', 'arkhe-blocks')} initialOpen={true}>
					{0 !== imgId && (
						<SelectControl
							label={__('Image size')}
							value={imgSize}
							options={sizeOptions}
							onChange={updateImagesSize}
						/>
					)}
					{ratioSettings}
				</PanelBody>
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
			</InspectorControls>
		</>
	);
});
