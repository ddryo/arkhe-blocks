/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	MediaUpload,
	MediaUploadCheck,
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
	CheckboxControl,
	ButtonGroup,
	Button,
	Popover,
	FocalPointPicker,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

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
		opacity,
		bgFocalPoint,
		padPC,
		padSP,
		padUnitPC,
		padUnitSP,
		innerSize,
		topSvgLevel,
		bottomSvgLevel,
		topSvgType,
		bottomSvgType,
		isReTop,
		isReBottom,
		isRepeat,
	} = attributes;

	const [isOpenBgPicker, setIsOpenBgPicker] = useState(false);

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
			<PanelBody title='カラー設定'>
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
				<BaseControl className='-fullWideBgColor'>
					<BaseControl.VisualLabel>
						{imgUrl ? 'オーバーレイカラー' : '背景色'}
					</BaseControl.VisualLabel>
					<div className='__body'>
						<div className='__color'>
							<ColorPalette
								// value={textColor}
								colors={[{ name: 'カスタムカラー', color: bgColor }]}
								disableCustomColors
								clearable={false}
								onChange={() => {
									if (isOpenBgPicker) {
										setIsOpenBgPicker(false);
									} else {
										setIsOpenBgPicker(true);
									}
								}}
							/>
							{isOpenBgPicker && (
								<Popover
									// noArrow={false}
									position='bottom'
									className='-fullWideBgColor'
									onFocusOutside={() => {
										setIsOpenBgPicker(false);
									}}
								>
									<ColorPicker
										clearable={false}
										color={bgColor}
										disableAlpha
										onChangeComplete={(val) => {
											const rgb = val.rgb;
											if (1 !== rgb.a) {
												const rgbaColor = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
												setAttributes({
													bgColor: rgbaColor,
												});
											} else {
												setAttributes({
													bgColor: val.hex,
												});
											}
										}}
									/>
								</Popover>
							)}
						</div>
						<div className='__label'>好きな色を選択できます。</div>
					</div>
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

				<TextControl
					className='u-mb-5'
					label='画像URL'
					value={imgUrl}
					placeholder='URLを直接入力できます'
					onChange={(val) => {
						if (!val) {
							// 画像削除されたら
							setAttributes({ imgUrl: undefined, opacity: 100 });
						} else {
							setAttributes({
								imgUrl: val,
								...(100 === opacity ? { opacity: 50 } : {}),
							});
						}
					}}
				/>

				<div className='arkb-btns--media'>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => {
								// console.log(media);

								// 画像がなければ
								if (!media || !media.url) {
									setAttributes({
										imgId: 0,
										imgUrl: undefined,
										imgW: undefined,
										imgH: undefined,
										opacity: 100,
										bgFocalPoint: undefined,
									});
									return;
								}

								setAttributes({
									imgId: media.id,
									imgUrl: media.url,
									imgW: media.width,
									imgH: media.height,
									...(100 === opacity ? { opacity: 50 } : {}),
								});
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
							className='arkb-btn--delete'
							onClick={() => {
								setAttributes({
									imgId: 0,
									imgUrl: undefined,
									imgW: undefined,
									imgH: undefined,
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
						label={__('Focal Point Picker')}
						url={imgUrl}
						value={bgFocalPoint}
						onChange={(value) => setAttributes({ bgFocalPoint: value })}
					/>
				)}
			</PanelBody>
			<PanelBody title={__('上部の境界線の形状', 'arkhe-blocks')}>
				<BaseControl>
					<BaseControl.VisualLabel>
						{__('上部の境界線の形状', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns-minWidth'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type.value !== topSvgType}
									isPrimary={type.value === topSvgType}
									onClick={() => {
										setAttributes({
											topSvgType: type.value,
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
				{'line' === topSvgType && (
					<BaseControl>
						<CheckboxControl
							label='逆向きにする'
							checked={isReTop}
							onChange={(val) => setAttributes({ isReTop: val })}
						/>
					</BaseControl>
				)}
				<RangeControl
					label='上部の境界線の高さレベル'
					value={topSvgLevel}
					onChange={(val) => {
						setAttributes({
							topSvgLevel: val,
						});
					}}
					min={0}
					max={5}
					step={0.1}
				/>

				<BaseControl>
					<BaseControl.VisualLabel>
						{__('下部の境界線の形状', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<ButtonGroup className='arkb-btns-minWidth'>
						{svgTypes.map((type) => {
							return (
								<Button
									isSecondary={type.value !== bottomSvgType}
									isPrimary={type.value === bottomSvgType}
									onClick={() => {
										setAttributes({
											bottomSvgType: type.value,
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
				{'line' === bottomSvgType && (
					<BaseControl>
						<CheckboxControl
							label='逆向きにする'
							checked={isReBottom}
							onChange={(val) => setAttributes({ isReBottom: val })}
						/>
					</BaseControl>
				)}
				<RangeControl
					label='下部の境界線の高さレベル'
					value={bottomSvgLevel}
					onChange={(val) => {
						setAttributes({
							bottomSvgLevel: val,
						});
					}}
					min={0}
					max={5}
					step={0.1}
				/>
			</PanelBody>
		</>
	);
};
