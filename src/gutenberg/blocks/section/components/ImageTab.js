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
		mediaUrl,
		mediaId,
		focalPoint,
		mediaUrlSP,
		mediaIdSP,
		focalPointSP,
		isRepeat,
		opacity,
		setAttributes,
	} = props;

	const setImagePC = (media) => {
		setAttributes({
			mediaId: media.id,
			mediaUrl: media.url,
			mediaWidth: media.width,
			mediaHeight: media.height,
			mediaType: media.type,
			...(100 === opacity ? { opacity: 50 } : {}),
		});
	};

	const removeImagePC = () => {
		setAttributes({
			mediaId: 0,
			mediaUrl: '',
			mediaWidth: undefined,
			mediaHeight: undefined,
			mediaType: '',
			focalPoint: undefined,
			...(!mediaUrlSP ? { opacity: 100 } : {}), // SP画像もなければ カラー100に。
		});
	};

	const setImageSP = (media) => {
		setAttributes({
			mediaIdSP: media.id,
			mediaUrlSP: media.url,
			mediaWidthSP: media.width,
			mediaHeightSP: media.height,
			mediaTypeSP: media.type,
		});
	};

	const removeImageSP = () => {
		setAttributes({
			mediaIdSP: 0,
			mediaUrlSP: undefined,
			mediaWidthSP: undefined,
			mediaHeightSP: undefined,
			mediaTypeSP: '',
			focalPointSP: undefined,
			...(!mediaUrl ? { opacity: 100 } : {}), // PC画像もなければ カラー100に。
		});
	};

	const noImageView = (
		<div className='arkb-imgPreview -noimage'>
			<Icon icon={image} /> / <Icon icon={video} />
		</div>
	);

	const imageSettingPC = (
		<>
			{mediaUrl && !isRepeat && (
				<FocalPointPicker
					url={mediaUrl}
					value={focalPoint}
					onChange={(val) => {
						setAttributes({ focalPoint: val });
					}}
				/>
			)}
			{!mediaUrl && noImageView}
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(media) => {
							// console.log(media);
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
			{mediaUrlSP && (
				<FocalPointPicker
					url={mediaUrlSP}
					value={focalPointSP}
					onChange={(val) => {
						setAttributes({ focalPointSP: val });
					}}
				/>
			)}
			{!mediaUrlSP && noImageView}
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
						allowedTypes={['image', 'video']}
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
		<ArkDeviceTab
			className={addClass}
			controlPC={imageSettingPC}
			controlSP={imageSettingSP}
			isHideTab={isRepeat}
		/>
	);
});
