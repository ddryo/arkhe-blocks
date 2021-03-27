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
		setImagePC,
		removeImagePC,
		setImageSP,
		removeImageSP,
		mediaType,
		mediaUrl,
		mediaId,
		focalPoint,
		mediaUrlSP,
		mediaIdSP,
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
		<div className='arkb-imgPreview -noimage'>
			<Icon icon={image} /> / <Icon icon={video} />
		</div>;
	}

	const imageSettingPC = (
		<>
			{!mediaUrl && noImageView}
			{mediaUrl && (
				<FocalPointPicker
					url={mediaUrl}
					value={focalPoint}
					onChange={(val) => {
						setAttributes({ focalPoint: val });
					}}
				/>
			)}
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

	const imageSettingSP = (
		<>
			{!mediaUrlSP && noImageView}
			{mediaUrlSP && (
				<FocalPointPicker
					url={mediaUrlSP}
					value={focalPointSP}
					onChange={(val) => {
						setAttributes({ focalPointSP: val });
					}}
				/>
			)}
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
