/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useMemo } from '@wordpress/element';
import { MediaPlaceholder, BlockControls, MediaReplaceFlow } from '@wordpress/block-editor';
/**
 * @Internal dependencies
 */

/**
 * @Others dependencies
 */
import classnames from 'classnames';

export const Figure = memo((props) => {
	const {
		url,
		id,
		alt,
		figureClass,
		figureStyle,
		imgClass,
		onSelect,
		onSelectURL,
		accept = 'image/*',
		allowedTypes = ['image'],
	} = props;

	// まだ画像が選択されていない時
	if (!url) {
		const mediaPreview = !!url && (
			<img
				alt={__('Edit image')}
				title={__('Edit image')}
				className={'edit-image-preview'}
				src={url}
			/>
		);

		return (
			<MediaPlaceholder
				icon='format-image'
				// labels='label?'
				onSelect={onSelect}
				onSelectURL={onSelectURL}
				accept={accept}
				allowedTypes={allowedTypes}
				value={{ id, url }}
				mediaPreview={mediaPreview}
				disableMediaButtons={url}
			/>
		);
	}

	// 画像が選択されている時
	return (
		<>
			<figure className={figureClass} style={figureStyle}>
				<img className={`${imgClass} wp-image-${id}`} src={url} alt={alt} />
			</figure>
		</>
	);
});
