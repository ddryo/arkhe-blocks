/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	useBlockProps,
	MediaPlaceholder,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalBlockAlignmentMatrixToolbar,
	__experimentalBlockAlignmentMatrixControl,
} from '@wordpress/block-editor';
import { Icon } from '@wordpress/icons';
import { useCallback } from '@wordpress/element';

/**
 * @Internal dependencies
 */
import { mediaIcon } from '../slider/_icon';
import { SlideMedia } from './components/SlideMedia';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * const
 */
const blockName = 'ark-block-slider';

/**
 * Media Slider
 */
export const MediaEdit = ({ attributes, setAttributes }) => {
	const { media } = attributes;

	const mediaId = media.id;
	const mediaUrl = media.url;

	// BlockProps
	const blockProps = useBlockProps({
		className: `${blockName}__slide`,
	});

	const onSelect = useCallback(
		(newMedia) => {
			setAttributes({
				alt: newMedia.alt,
				media: {
					id: newMedia.id,
					url: newMedia.url,
					type: newMedia.type,
					size: 'full',
					width: newMedia.width,
					height: newMedia.height,
				},
			});
		},
		[setAttributes]
	);

	return (
		<>
			<div {...blockProps}>
				{mediaUrl ? (
					<SlideMedia {...{ attributes }} />
				) : (
					<MediaPlaceholder
						className='is-large'
						labels={{
							title: __('Media', 'arkhe-blocks'),
							instructions: __(
								'Upload an image or video file, or pick one from your media library.'
							),
						}}
						icon={<Icon icon={mediaIcon} />}
						onSelect={onSelect}
						accept='image/*,video/*'
						allowedTypes={['image', 'video']}
						value={{ mediaId, mediaUrl }}
						disableMediaButtons={mediaUrl}
					/>
				)}
			</div>
		</>
	);
};

/**
 * Rich Slider
 */
export const RichEdit = ({ attributes, setAttributes }) => {
	const {
		// variation,
		// media,
		// mediaSP,
		bgColor,
		bgGradient,
		opacity,
		textColor,
		contentPosition,
		paddingPC,
		paddingSP,
		filter,
	} = attributes;

	// BlockProps
	const blockProps = useBlockProps({
		className: `${blockName}__slide`,
		style: {
			'--arkb-slide-padding': `${paddingPC.top} ${paddingPC.right} ${paddingPC.bottom} ${paddingPC.left}`,
			'--arkb-slide-padding--sp': `${paddingSP.top} ${paddingSP.right} ${paddingSP.bottom} ${paddingSP.left}`,
		},
	});

	const colorLayerStyle = {
		background: bgGradient || bgColor,
		opacity: (opacity * 0.01).toFixed(2),
	};
	const txtLayerStyle = {};
	if (textColor) {
		txtLayerStyle.color = textColor;
	}
	const innerBlocksProps = useInnerBlocksProps(
		{ className: `${blockName}__bodyInner ark-keep-mt--s`, style: txtLayerStyle },
		{
			// template: [['core/paragraph']],
			templateLock: false,
		}
	);

	const BlockAlignmentMatrixControl =
		__experimentalBlockAlignmentMatrixControl || __experimentalBlockAlignmentMatrixToolbar;

	return (
		<>
			<BlockControls group='block'>
				<BlockAlignmentMatrixControl
					label={__('Change content position')}
					value={contentPosition}
					onChange={(nextPosition) => {
						setAttributes({ contentPosition: nextPosition });
					}}
				/>
			</BlockControls>
			<div {...blockProps}>
				<SlideMedia {...{ attributes }} />
				<div className={`${blockName}__color arkb-absLayer`} style={colorLayerStyle}></div>
				{'off' !== filter && (
					<div className={`c-filterLayer -filter-${filter} arkb-absLayer`}></div>
				)}
				<div
					className={`${blockName}__body`}
					data-content={contentPosition.replace(' ', '-')}
					style={txtLayerStyle}
				>
					<div {...innerBlocksProps} />
				</div>
			</div>
		</>
	);
};
