/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
// import { useSelect } from '@wordpress/data';
import {
	// InspectorControls,
	BlockControls,
	useBlockProps,
	MediaPlaceholder,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalBlockAlignmentMatrixToolbar as BlockAlignmentMatrixToolbar,
} from '@wordpress/block-editor';
// import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { useCallback } from '@wordpress/element';

/**
 * @Internal dependencies
 */
// import SlideSidebar from './_sidebar';
import { SlideMedia } from './components/SlideMedia';
import { mediaIcon } from '../slider/_icon';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * const
 */
const blockName = 'ark-block-slider';

/**
 *
 */
export const MediaEdit = ({ attributes, setAttributes }) => {
	const { mediaId, mediaUrl } = attributes;
	// BlockProps
	const blockProps = useBlockProps({
		className: `${blockName}__slide`,
	});

	const onSelect = useCallback(
		(media) => {
			setAttributes({
				alt: media.alt,
				mediaId: media.id,
				mediaUrl: media.url,
				mediaType: media.type,
				mediaWidth: media.width,
				mediaHeight: media.height,
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
							title: __('メディア', 'arkhe-blocks'),
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
		bgColor,
		bgGradient,
		opacity,
		textColor,
		contentPosition,
		paddingPC,
		paddingSP,
		// widthPC,
		// widthSP,
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

	return (
		<>
			<BlockControls>
				<BlockAlignmentMatrixToolbar
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
