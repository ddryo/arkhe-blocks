/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, FocalPointPicker } from '@wordpress/components';
import { Icon, video, image } from '@wordpress/icons';

/**
 * @Inner dependencies
 */
import { ArkDeviceTab } from '@components/ArkDeviceTab';
import { ImageSizeSelect } from '@components/ImageSizeSelect';

/**
 * export
 */
export const ImageTab = memo((props) => {
	const {
		isRichSlider,
		setImagePC,
		removeImagePC,
		setImageSP,
		removeImageSP,
		updateImageSizePC,
		updateImageSizeSP,
		media,
		mediaSP,
		focalPoint,
		focalPointSP,
		setAttributes,
	} = props;

	const mediaUrl = media.url;
	const mediaUrlSP = mediaSP.url;

	let noImageView = null;
	if ('image' === media.type) {
		noImageView = (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={image} />
			</div>
		);
	} else if ('video' === media.type) {
		noImageView = (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={video} />
			</div>
		);
	} else {
		noImageView = (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={image} /> / <Icon icon={video} />
			</div>
		);
	}

	//メディアプレビュー
	let mediaPreviewPC = noImageView;
	if (isRichSlider && mediaUrl) {
		mediaPreviewPC = (
			<FocalPointPicker
				url={mediaUrl}
				value={focalPoint}
				onChange={(val) => {
					setAttributes({ focalPoint: val });
				}}
			/>
		);
	} else if (!isRichSlider && mediaUrl) {
		mediaPreviewPC = (
			<div className='arkb-imgPreview'>
				{'image' === media.type && <img src={mediaUrl} alt='' />}
				{'video' === media.type && <video src={mediaUrl} />}
			</div>
		);
	}

	const imageSettingPC = (
		<>
			{mediaPreviewPC}
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(newMedia) => {
							if (newMedia) {
								setImagePC(newMedia);
							} else {
								removeImagePC();
							}
						}}
						allowedTypes={['image', 'video']}
						value={media.id}
						render={({ open }) => (
							<Button isPrimary onClick={open}>
								{mediaUrl
									? __('Change media', 'arkhe-blocks')
									: __('Select media', 'arkhe-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				{mediaUrl && (
					<Button
						isSecondary
						className='__delete'
						onClick={() => {
							removeImagePC();
						}}
					>
						{__('Delete', 'arkhe-blocks')}
					</Button>
				)}
			</div>
			{0 !== media.id && 'image' === media.type && (
				<ImageSizeSelect
					className='arkb-ctrl--mt--s'
					imgId={media.id}
					imgSize={media.size}
					updateImageSize={updateImageSizePC}
				/>
			)}
		</>
	);

	//メディアプレビュー
	let mediaPreviewSP = noImageView;
	if (isRichSlider && mediaUrlSP) {
		mediaPreviewSP = (
			<FocalPointPicker
				url={mediaUrlSP}
				value={focalPointSP}
				onChange={(val) => {
					setAttributes({ focalPointSP: val });
				}}
			/>
		);
	} else if (!isRichSlider && mediaUrlSP) {
		mediaPreviewSP = (
			<div className='arkb-imgPreview'>
				{'image' === mediaSP.type && <img src={mediaUrlSP} alt='' />}
				{'video' === mediaSP.type && <video src={mediaUrlSP} />}
			</div>
		);
	}

	const imageSettingSP = (
		<>
			{mediaPreviewSP}
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(newMedia) => {
							if (newMedia) {
								setImageSP(newMedia);
							} else {
								removeImageSP();
							}
						}}
						allowedTypes={[media.type]}
						value={mediaSP.id}
						render={({ open }) => (
							<Button isPrimary onClick={open}>
								{mediaUrlSP
									? __('Change media', 'arkhe-blocks')
									: __('Select media', 'arkhe-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				{mediaUrlSP && (
					<Button
						isSecondary
						className='__delete'
						onClick={() => {
							removeImageSP();
						}}
					>
						{__('Delete', 'arkhe-blocks')}
					</Button>
				)}
			</div>
			{0 !== mediaSP.id && 'image' === mediaSP.type && (
				<ImageSizeSelect
					className='arkb-ctrl--mt--s'
					imgId={mediaSP.id}
					imgSize={mediaSP.size}
					updateImageSize={updateImageSizeSP}
				/>
			)}
		</>
	);

	let addClass = `-media`;
	if (!mediaUrl) {
		addClass += ' has-no-pcimg';
	}

	return (
		<ArkDeviceTab className={addClass} controlPC={imageSettingPC} controlSP={imageSettingSP} />
	);
});
