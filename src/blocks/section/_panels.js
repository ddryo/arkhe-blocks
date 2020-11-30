/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	MediaUpload,
	MediaUploadCheck,
	ColorPalette as WpColorPalette,
	// getColorObjectByColorValue,
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
	// RadioControl,
	// CheckboxControl,
	ButtonGroup,
	Button,
	// Popover,
	TabPanel,
	FocalPointPicker,
} from '@wordpress/components';
// import { useState } from '@wordpress/element';

/**
 * 設定
 */
const padUnits = ['px', 'rem', 'em', '%', 'vw', 'vh'];

const textColorSet = [
	{
		name: '白',
		color: '#fff',
	},
	{
		name: '黒',
		color: '#000',
	},
];

const innerSizes = [
	{
		label: 'コンテンツ幅',
		value: '',
	},
	{
		label: 'フル幅',
		value: 'full',
	},
];

const svgTypes = [
	{
		label: '斜線',
		value: 'line',
	},
	{
		label: '円',
		value: 'circle',
	},
	{
		label: '波',
		value: 'wave',
	},
	{
		label: 'ジグザグ',
		value: 'zigzag',
	},
];

export default (props) => {
	const { attributes, setAttributes } = props;

	const {
		bgColor,
		textColor,
		imgUrl,
		imgId,
		bgFocalPoint,
		imgUrlSP,
		imgIdSP,
		bgFocalPointSP,
		opacity,
		padPC,
		padSP,
		padUnitPC,
		padUnitSP,
		innerSize,
		svgLevelTop,
		svgLevelBottom,
		svgTypeTop,
		svgTypeBottom,
		svgColorTop,
		svgColorBottom,
		isRepeat,
	} = attributes;

	// const [isOpenBgPicker, setIsOpenBgPicker] = useState(false);

	// const onColorChange = useCallback(
	// 	(color) => {
	// 		console.log(color);
	// 		const colorObject = getColorObjectByColorValue(colors, color);
	// 	},
	// 	[colors]
	// );
	// const onColorChange = (color) => {
	// 	console.log(color);
	// 	// const colorObject = getColorObjectByColorValue(colors, color);
	// };

	const imageSettingPC = (
		<>
			{/* <TextControl
				className='arkb-input--mediaUrl'
				label={__('画像', 'arkhe-blocks')}
				value={imgUrl}
				placeholder={__('画像URL', 'arkhe-blocks')}
				onChange={(val) => {
					setAttributes({ imgUrl: val });
				}}
			/> */}
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(media) => {
							// console.log(media);
							if (media) {
								setAttributes({
									imgId: media.id,
									imgUrl: media.url,
									imgWidth: media.width,
									imgHeight: media.height,
								});
							} else {
								setAttributes({
									imgId: 0,
									imgUrl: '',
									imgWidth: undefined,
									imgHeight: undefined,
									bgFocalPoint: undefined,
								});
							}
						}}
						allowedTypes={'image'}
						value={imgId}
						render={({ open }) => (
							<Button isPrimary onClick={open}>
								{imgUrl
									? __('画像を変更', 'arkhe-blocks')
									: __('メディアから選択', 'arkhe-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				{imgUrl && (
					<Button
						isSecondary
						className='__delete'
						onClick={() => {
							setAttributes({
								imgId: 0,
								imgUrl: '',
								imgWidth: undefined,
								imgHeight: undefined,
								opacity: 100,
								bgFocalPoint: undefined,
							});
						}}
					>
						{__('Delete', 'arkhe-blocks')}
					</Button>
				)}
			</div>
			{imgUrl && !isRepeat && (
				<FocalPointPicker
					label={__('Focal point picker')}
					url={imgUrl}
					value={bgFocalPoint}
					onChange={(value) => setAttributes({ bgFocalPoint: value })}
				/>
			)}
		</>
	);

	const imageSettingSP = (
		<>
			{/* <TextControl
				className='arkb-input--mediaUrl'
				label={__('画像', 'arkhe-blocks')}
				value={imgUrlSP || ''}
				placeholder={__('画像URL', 'arkhe-blocks')}
				onChange={(val) => {
					setAttributes({ imgUrlSP: val });
				}}
			/> */}
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(media) => {
							// console.log(media);
							if (media) {
								setAttributes({
									imgIdSP: media.id,
									imgUrlSP: media.url,
									imgWidthSP: media.width,
									imgHeightSP: media.height,
								});
							} else {
								setAttributes({
									imgIdSP: 0,
									imgUrlSP: undefined,
									imgWidthSP: undefined,
									imgHeightSP: undefined,
									bgFocalPointSP: undefined,
								});
							}
						}}
						allowedTypes={'image'}
						value={imgIdSP}
						render={({ open }) => (
							<Button isPrimary onClick={open}>
								{imgUrlSP
									? __('画像を変更', 'arkhe-blocks')
									: __('メディアから選択', 'arkhe-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				{imgUrlSP && (
					<Button
						isSecondary
						className='__delete'
						onClick={() => {
							setAttributes({
								imgIdSP: 0,
								imgUrlSP: undefined,
								imgWidthSP: undefined,
								imgHeightSP: undefined,
								bgFocalPointSP: undefined,
							});
						}}
					>
						{__('Delete', 'arkhe-blocks')}
					</Button>
				)}
			</div>
			{imgUrlSP && (
				<FocalPointPicker
					label={__('Focal point picker')}
					url={imgUrlSP}
					value={bgFocalPointSP}
					onChange={(value) => setAttributes({ bgFocalPointSP: value })}
				/>
			)}
		</>
	);

	const bgImgTabs = [
		{
			name: 'pc',
			title: (
				<>
					<i className='dashicons-before dashicons-admin-settings'></i>

					{_x('PC', 'tab-panel', 'arkhe-blocks')}
				</>
			),
			className: '__pc',
		},
	];
	if (!isRepeat) {
		bgImgTabs.push({
			name: 'sp',
			title: (
				<>
					<i className='dashicons-before dashicons-post-status'></i>
					{_x('SP', 'tab-panel', 'arkhe-blocks')}
				</>
			),
			className: '__sp',
		});
	}

	return (
		<>
			<PanelBody title={__('Size settings', 'arkhe-blocks')}>
				<BaseControl>
					<BaseControl.VisualLabel>
						{__('コンテンツの横幅', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<ButtonGroup>
						{innerSizes.map((size) => {
							return (
								<Button
									isSecondary={size.value !== innerSize}
									isPrimary={size.value === innerSize}
									onClick={() => {
										setAttributes({
											innerSize: size.value,
										});
									}}
									key={`key_${size.value}`}
								>
									{size.label}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<div className='ark-control--padding'>
					<div className='__label'>{__('上下のpadding量', 'arkhe-blocks') + '(PC)'}</div>
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
					<div className='__label'>{__('上下のpadding量', 'arkhe-blocks') + '(SP)'}</div>
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
						{__('テキストカラー', 'arkhe-blocks')}
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
						{imgUrl ? 'オーバーレイカラー' : '背景色'}
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
					label={imgUrl ? 'オーバーレイの不透明度' : '背景色の不透明度'}
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
			<PanelBody title='背景画像の設定'>
				<ToggleControl
					label={__('背景画像をリピートする', 'arkhe-blocks')}
					checked={isRepeat}
					onChange={(val) => {
						setAttributes({ isRepeat: val });
						if (val) {
							setAttributes({ bgFocalPoint: undefined });
						}
					}}
				/>
				<TabPanel
					className={`arkb-tabPanel -section is-hide-${isRepeat}`}
					activeClass='is-active'
					tabs={bgImgTabs}
					initialTabName='pc'
				>
					{(tab) => {
						if ('pc' === tab.name) {
							return imageSettingPC;
						} else if ('sp' === tab.name) {
							return imageSettingSP;
						}
					}}
				</TabPanel>
			</PanelBody>
			<PanelBody title={__('上部の境界線', 'arkhe-blocks')} initialOpen={false}>
				<BaseControl>
					<BaseControl.VisualLabel>{__('形状', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns-minWidth'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type.value !== svgTypeTop}
									isPrimary={type.value === svgTypeTop}
									onClick={() => {
										setAttributes({
											svgTypeTop: type.value,
										});
									}}
									key={`key_${type.value}`}
								>
									{type.label}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<RangeControl
					label={__('高さレベル', 'arkhe-blocks')}
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
			<PanelBody title={__('下部の境界線', 'arkhe-blocks')} initialOpen={false}>
				<BaseControl>
					<BaseControl.VisualLabel>{__('形状', 'arkhe-blocks')}</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns-minWidth'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type.value !== svgTypeBottom}
									isPrimary={type.value === svgTypeBottom}
									onClick={() => {
										setAttributes({ svgTypeBottom: type.value });
									}}
									key={`key_${type.value}`}
								>
									{type.label}
								</Button>
							);
						})}
					</ButtonGroup>
				</BaseControl>
				<RangeControl
					label={__('高さレベル', 'arkhe-blocks')}
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
		</>
	);
};
