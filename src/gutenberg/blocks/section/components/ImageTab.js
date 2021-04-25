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
	const { media, mediaSP, focalPoint, focalPointSP, isRepeat, opacity, setAttributes } = props;

	const mediaUrl = media.url;
	const mediaUrlSP = mediaSP.url;

	const setImagePC = (newMedia) => {
		setAttributes({
			media: {
				id: newMedia.id,
				url: newMedia.url,
				type: newMedia.type,
				width: newMedia.width,
				height: newMedia.height,
				// size: 'full',
			},
			...(100 === opacity ? { opacity: 50 } : {}),
		});

		// セット済みのメディアSPの形式が違う場合は削除する
		if (mediaSP.url && newMedia.type !== mediaSP.type) {
			removeImageSP();
		}
	};

	const removeImagePC = () => {
		setAttributes({
			media: {
				id: 0,
				url: '',
				type: '',
				// size: 'full',
			},
			focalPoint: undefined,
			...(!mediaSP.url ? { opacity: 100 } : {}), // SP画像もなければ カラー100に。
		});
	};

	const setImageSP = (newMedia) => {
		setAttributes({
			mediaSP: {
				id: newMedia.id,
				url: newMedia.url,
				type: newMedia.type,
				width: newMedia.width,
				height: newMedia.height,
				// size: 'full',
			},
		});
	};

	const removeImageSP = () => {
		setAttributes({
			mediaSP: {
				id: 0,
				url: '',
				type: '',
				// size: 'full',
			},
			focalPointSP: undefined,
			...(!media.url ? { opacity: 100 } : {}), // PC画像もなければ カラー100に。
		});
	};

	let allowedTypes = null;
	let noImageView = null;
	if (isRepeat || 'image' === media.type) {
		noImageView = (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={image} />
			</div>
		);
		allowedTypes = ['image'];
	} else if ('video' === media.type) {
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

	const mediaOnSelect = (newMedia) => {
		if (newMedia) {
			setImagePC(newMedia);
		} else {
			removeImagePC();
		}
	};
	const mediaOnSelectSP = (newMedia) => {
		if (newMedia) {
			setImageSP(newMedia);
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
						value={media.id}
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
						value={mediaSP.id}
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
