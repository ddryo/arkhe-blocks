/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, TabPanel, FocalPointPicker } from '@wordpress/components';
import { Icon, mobile, desktop, video, image } from '@wordpress/icons';

/**
 * export
 */
export const ImageTab = memo((props) => {
	const {
		setImagePC,
		removeImagePC,
		setImageSP,
		removeImageSP,
		//,
		mediaUrl,
		mediaId,
		focalPoint,
		mediaUrlSP,
		mediaIdSP,
		focalPointSP,
		setAttributes,
	} = props;

	const noImageView = (
		<div className='arkb-imgPreview -noimage'>
			<Icon icon={image} /> / <Icon icon={video} />
		</div>
	);

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

	const bgImgTabs = [
		{
			name: 'pc',
			title: (
				<>
					<Icon icon={desktop} />
					<span>PC</span>
				</>
			),
			className: '__pc',
		},
		{
			name: 'sp',
			title: (
				<>
					<Icon icon={mobile} />
					<span>SP</span>
				</>
			),
			className: '__sp',
		},
	];

	let tabClass = `arkb-tabPanel -slider`;
	if (!mediaUrl) {
		tabClass += ' has-no-pcimg';
	}

	return (
		<TabPanel className={tabClass} activeClass='is-active' tabs={bgImgTabs} initialTabName='pc'>
			{(tab) => {
				if ('pc' === tab.name) {
					return imageSettingPC;
				} else if ('sp' === tab.name) {
					return imageSettingSP;
				}
			}}
		</TabPanel>
	);
});
