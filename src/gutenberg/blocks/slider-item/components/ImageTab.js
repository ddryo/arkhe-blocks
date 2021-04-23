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
		mediaType,
		mediaTypeSP,
		mediaUrl,
		mediaUrlSP,
		mediaId,
		mediaIdSP,
		focalPoint,
		focalPointSP,
		setAttributes,
	} = props;

	let noImageView = null;
	if ('image' === mediaType) {
		noImageView = (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={image} />
			</div>
		);
	} else if ('video' === mediaType) {
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
				{'image' === mediaType && <img src={mediaUrl} alt='' />}
				{'video' === mediaType && <video src={mediaUrl} />}
			</div>
		);
	}

	const imageSettingPC = (
		<>
			{mediaPreviewPC}
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(media) => {
							if (media) {
								setImagePC(media);
							} else {
								removeImagePC();
							}
						}}
						allowedTypes={['image', 'video']}
						value={mediaId}
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
				{'image' === mediaTypeSP && <img src={mediaUrlSP} alt='' />}
				{'video' === mediaTypeSP && <video src={mediaUrlSP} />}
			</div>
		);
	}

	const imageSettingSP = (
		<>
			{mediaPreviewSP}
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(media) => {
							if (media) {
								setImageSP(media);
							} else {
								removeImageSP();
							}
						}}
						allowedTypes={[mediaType]}
						value={mediaIdSP}
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
