/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
// import { memo } from '@wordpress/element';
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
export const ImageTab = (props) => {
	const {
		mediaUrl,
		mediaUrlSP,
		mediaId,
		mediaIdSP,
		mediaType,
		mediaTypeSP,
		focalPoint,
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

		// セット済みのメディアSPの形式が違う場合は削除する
		if (mediaUrlSP && media.type !== mediaTypeSP) {
			removeImageSP();
		}
	};

	const removeImagePC = () => {
		setAttributes({
			mediaId: 0,
			mediaUrl: '',
			mediaType: '',
			mediaWidth: undefined,
			mediaHeight: undefined,
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
			mediaUrlSP: '',
			mediaTypeSP: '',
			mediaWidthSP: undefined,
			mediaHeightSP: undefined,
			focalPointSP: undefined,
			...(!mediaUrl ? { opacity: 100 } : {}), // PC画像もなければ カラー100に。
		});
	};

	let allowedTypes = null;
	let noImageView = null;
	if (isRepeat || 'image' === mediaType) {
		noImageView = (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={image} />
			</div>
		);
		allowedTypes = ['image'];
	} else if ('video' === mediaType) {
		noImageView = (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={video} />
			</div>
		);
		allowedTypes = ['video'];
	} else {
		noImageView = (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={image} /> / <Icon icon={video} />
			</div>
		);
		allowedTypes = ['image', 'video'];
	}

	const mediaOnSelect = (media) => {
		if (media) {
			setImagePC(media);
		} else {
			removeImagePC();
		}
	};
	const mediaOnSelectSP = (media) => {
		if (media) {
			setImageSP(media);
		} else {
			removeImageSP();
		}
	};

	const mediaRender = ({ open }) => (
		<Button isPrimary onClick={open}>
			{mediaUrl ? __('Change media', 'arkhe-blocks') : __('Select media', 'arkhe-blocks')}
		</Button>
	);

	const mediaRenderSP = ({ open }) => (
		<Button isPrimary onClick={open}>
			{mediaUrlSP ? __('Change media', 'arkhe-blocks') : __('Select media', 'arkhe-blocks')}
		</Button>
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
						value={mediaId}
						onSelect={mediaOnSelect}
						allowedTypes={['image', 'video']} // 変数の変化が反映されないので、PC側が仕方なく常にどちらも許可。
						render={mediaRender}
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
						value={mediaIdSP}
						onSelect={mediaOnSelectSP}
						allowedTypes={allowedTypes}
						render={mediaRenderSP}
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
};
