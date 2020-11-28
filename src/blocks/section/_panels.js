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

export default (props) => {
	const { attributes, setAttributes } = props;

	const {
		bgColor,
		textColor,
		imgUrl,
		imgID,
		opacity,
		isFixBg,
		bgFocalPoint,
		isParallax,
		padPC,
		// padSP,
		padUnitPC,
		// padUnitSP,
		contentSize,
		topSvgLevel,
		bottomSvgLevel,
		topSvgType,
		bottomSvgType,
		isReTop,
		isReBottom,
	} = attributes;

	const [isOpenBgPicker, setIsOpenBgPicker] = useState(false);

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

	const padUnits = ['px', 'rem', 'em', '%', 'vw', 'vh'];

	const sizeData = [
		{
			label: '記事',
			value: 'article',
		},
		{
			label: 'サイト幅',
			value: 'container',
		},
		{
			label: 'フルワイド',
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

	return (
		<>
			<PanelBody title={__('Size settings', 'arkhe-blocks')}>
				<BaseControl>
					<BaseControl.VisualLabel>
						{__('コンテンツの横幅', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					<ButtonGroup>
						{sizeData.map((size) => {
							return (
								<Button
									isSecondary={size.value !== contentSize}
									isPrimary={size.value === contentSize}
									onClick={() => {
										setAttributes({
											contentSize: size.value,
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
					<TextControl
						label={__('上下のpadding量', 'arkhe-blocks') + '(PC)'}
						value={padPC}
						type='number'
						onChange={(val) => {
							// intに変換してから保存
							setAttributes({ padPC: parseInt(val) });
						}}
					/>
					<SelectControl
						label={__('Image size')}
						value={padUnitPC}
						options={padUnits.map((unit) => {
							return { label: unit, value: unit };
						})}
						onChange={(val) => {
							setAttributes({ padUnitPC: val });
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
				<TextControl
					className='u-mb-5'
					label='画像URL'
					value={imgUrl}
					placeholder='URLを直接入力できます'
					onChange={(val) => {
						if ('' === val) {
							// 画像削除されたら
							setAttributes({ imgUrl: '', opacity: 100 });
						} else {
							setAttributes({
								imgUrl: val,
								...(100 === opacity ? { opacity: 50 } : {}),
							});
						}
					}}
				/>

				<div className='swl-btns--media u-mb-20'>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => {
								// 画像がなければ
								if (!media || !media.url) {
									setAttributes({
										imgUrl: '',
										imgID: 0,
										opacity: 100,
									});
									return;
								}

								setAttributes({
									imgUrl: media.url,
									imgID: media.id,
									...(100 === opacity ? { opacity: 50 } : {}),
								});
							}}
							allowedTypes={'image'}
							value={imgID}
							render={({ open }) => (
								<Button isPrimary onClick={open}>
									メディアから選択
								</Button>
							)}
						/>
					</MediaUploadCheck>
					<Button
						isSecondary
						className='swl-btn--delete'
						onClick={() => {
							setAttributes({
								imgUrl: '',
								imgID: 0,
								opacity: 100,
							});
						}}
					>
						削除
					</Button>
				</div>

				{imgUrl && (
					<BaseControl>
						<BaseControl.VisualLabel>
							{__('背景効果', 'arkhe-blocks')}
						</BaseControl.VisualLabel>
						<ToggleControl
							label={__('Fixed Background')}
							checked={isFixBg}
							onChange={() => {
								setAttributes({
									isFixBg: !isFixBg, //逆転させる
									isParallax: false,
									bgFocalPoint: undefined,
									// ...(!hasParallax ? { focalPoint: undefined } : {}),
								});
							}}
						/>
						<ToggleControl
							label='パララックス効果をつける'
							checked={isParallax}
							onChange={() => {
								setAttributes({
									isParallax: !isParallax, //逆転させる
									isFixBg: false,
									bgFocalPoint: undefined,
									// ...(!hasParallax ? { focalPoint: undefined } : {}),
								});
							}}
						/>
					</BaseControl>
				)}
				{imgUrl && !isFixBg && !isParallax && (
					<FocalPointPicker
						label={__('Focal Point Picker')}
						url={imgUrl}
						value={bgFocalPoint}
						onChange={(value) => setAttributes({ bgFocalPoint: value })}
					/>
				)}
			</PanelBody>
			{!imgUrl && (
				<PanelBody title='上下の境界線の形状'>
					<BaseControl>
						<BaseControl.VisualLabel>
							{__('上部の境界線の形状', 'arkhe-blocks')}
						</BaseControl.VisualLabel>
						<ButtonGroup className='swl-btns-minWidth'>
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
						<ButtonGroup className='swl-btns-minWidth'>
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
			)}
		</>
	);
};
