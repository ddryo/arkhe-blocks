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
	IconButton,
	Toolbar,
	SelectControl,
	TextControl,
	BaseControl,
	// RadioControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
	ToolbarButton,
	// ToolbarGroup,
	TextareaControl,
	Popover,
} from '@wordpress/components';
// import { link } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
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
		align,
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

	// const attrClass = attributes.className || '';
	// const isBannerStyle = -1 !== attrClass.indexOf('is-style-banner');

	// 縦並びか横並びかを変数化
	const isVertical = 'vertical' === layout;

	// 画像比率の設定
	const rationHelp = isVertical
		? __('By default, it has the same ratio as thumbnails in the archive list.', 'arkhe-blocks')
		: null;

	const ratioConrtol = (
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
	);
	const ratioSettings = isVertical ? (
		<>
			<ToggleControl
				label={__('Fix image ratio', 'arkhe-blocks')}
				checked={fixRatio}
				onChange={(val) => {
					setAttributes({ fixRatio: val });
				}}
			/>
			{fixRatio && ratioConrtol}
		</>
	) : (
		ratioConrtol
	);

	// アイコン選択時
	const setIcon = useCallback((val, isSelected) => {
		const newIcon = isSelected ? '' : val;
		setAttributes({ icon: newIcon });
	}, []);

	return (
		<>
			<BlockControls>
				<Toolbar>
					<IconButton
						className={classnames('components-toolbar__control', {
							'is-pressed': 'center' === align,
						})}
						label={__('Center the text', 'arkhe-blocks')}
						icon={
							<svg
								width='24'
								height='24'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								role='img'
								aria-hidden='true'
								focusable='false'
							>
								<path d='M16.4 4.2H7.6v1.5h8.9V4.2zM4 11.2v1.5h16v-1.5H4zm3.6 8.6h8.9v-1.5H7.6v1.5z'></path>
							</svg>
						}
						onClick={() => {
							const newAlign = 'center' !== align ? 'center' : undefined;
							setAttributes({ align: newAlign });
						}}
					/>
				</Toolbar>
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
						<Toolbar>
							<IconButton
								className='components-toolbar__control'
								label={__('Delete image', 'arkhe-blocks')}
								icon='no-alt'
								onClick={onRemoveImage}
							/>
						</Toolbar>
					</>
				)}

				<Toolbar>
					<ToolbarButton
						name='link'
						icon='admin-links'
						// icon={link}
						title={__('Link')}
						onClick={() => {
							setIsURLPickerOpen(true);
						}}
					/>
				</Toolbar>
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
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
					<BaseControl>
						<BaseControl.VisualLabel>
							{__('Box layout', 'arkhe-blocks')}
						</BaseControl.VisualLabel>
						<ButtonGroup className='ark-notice-btns'>
							{layoutBtns.map((btn) => {
								return (
									<Button
										isPrimary={layout === btn.value}
										key={`ark-${btn.value}`}
										onClick={() => {
											setAttributes({
												layout: btn.value,
												ratio: undefined,
											});
										}}
									>
										{btn.label}
									</Button>
								);
							})}
						</ButtonGroup>
					</BaseControl>
					<BaseControl>
						<BaseControl.VisualLabel>
							{__('HTML tag for title', 'arkhe-blocks')}
						</BaseControl.VisualLabel>
						<ButtonGroup className='ark-btns--minWidth'>
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
				<PanelBody title={__('"READ MORE" settings', 'arkhe-blocks')} initialOpen={true}>
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
			</InspectorControls>
		</>
	);
});
