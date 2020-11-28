/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
// import { useState } from '@wordpress/element';
import {
	MediaUpload,
	MediaUploadCheck,
	// MediaPlaceholder,
} from '@wordpress/block-editor';
import { Toolbar, IconButton } from '@wordpress/components';

import blockIcon from './_icon';

export default (props) => {
	const { attributes, setAttributes } = props;

	const { contentSize, bgImageID, bgImageUrl, bgOpacity } = attributes;
	const toolbarControls = [
		{
			icon: blockIcon.article,
			title: 'コンテンツ幅：記事と同じ',
			isActive: 'article' === contentSize,
			onClick: () => setAttributes({ contentSize: 'article' }),
		},
		{
			icon: blockIcon.container,
			title: 'コンテンツ幅：サイト幅',
			isActive: 'container' === contentSize,
			onClick: () => setAttributes({ contentSize: 'container' }),
		},
		{
			icon: blockIcon.full,
			title: 'コンテンツ幅：フルワイド',
			isActive: 'full' === contentSize,
			onClick: () => setAttributes({ contentSize: 'full' }),
		},
	];
	return (
		<>
			<Toolbar controls={toolbarControls} />
			<MediaUploadCheck>
				<Toolbar>
					<MediaUpload
						onSelect={(media) => {
							// 画像がなければ
							if (!media || !media.url) {
								setAttributes({
									bgImageUrl: '',
									bgImageID: 0,
									bgOpacity: 100,
								});
								return;
							}

							setAttributes({
								bgImageUrl: media.url,
								bgImageID: media.id,
								...(100 === bgOpacity ? { bgOpacity: 50 } : {}),
							});
						}}
						allowedTypes={'image'}
						value={bgImageID}
						render={({ open }) => (
							<IconButton
								className='components-toolbar__control'
								label='背景画像を選択'
								icon='edit'
								onClick={open}
							/>
						)}
					/>
				</Toolbar>
				{bgImageUrl && (
					<Toolbar>
						<IconButton
							className='components-toolbar__control'
							label='背景画像を削除'
							icon='no-alt'
							onClick={() => {
								setAttributes({
									bgImageUrl: '',
									bgImageID: 0,
									bgOpacity: 100,
								});
							}}
						/>
					</Toolbar>
				)}
			</MediaUploadCheck>
		</>
	);
};
