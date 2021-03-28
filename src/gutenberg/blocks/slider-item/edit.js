/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	__experimentalBlockAlignmentMatrixToolbar as BlockAlignmentMatrixToolbar,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
// import { Icon, fullscreen } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import SlideSidebar from './_sidebar';
import { SlideMedia } from './components/SlideMedia';
import { getPositionClassName } from '@helper/getPositionClassName';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * const
 */
const blockName = 'ark-block-slider';

/**
 *
 */
export const MediaEdit = ({ attributes, setAttributes, clientId }) => {
	const { variation, mediaUrl } = attributes;

	// BlockProps
	const blockProps = useBlockProps({
		className: `${blockName}__slide -${variation}`,
	});

	return (
		<>
			<InspectorControls>
				<SlideSidebar {...{ attributes, setAttributes, clientId }} />
			</InspectorControls>
			<div {...blockProps}>
				{mediaUrl ? <SlideMedia {...{ attributes }} /> : <div>画像を選択してね</div>}
			</div>
		</>
	);
};

/**
 * Rich Slider
 */
export const RichEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		variation,
		bgColor,
		bgGradient,
		opacity,
		textColor,
		contentPosition,
		padPC,
		padSP,
		widthPC,
		widthSP,
	} = attributes;

	// BlockProps
	const positionClass = getPositionClassName(contentPosition, 'center center');
	const blockClass = classnames(`${blockName}__slide -${variation}`, positionClass);

	const blockProps = useBlockProps({
		className: blockClass,
		style: {
			'--arkb-slide-pad-x': padPC.x,
			'--arkb-slide-pad-y': padPC.y,
			'--arkb-slide-pad-y--sp': padSP.y,
			'--arkb-slide-pad-x--sp': padSP.x,
			'--arkb-slide-width': widthPC,
			'--arkb-slide-width--sp': widthSP,
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
		{ className: `${blockName}__txtLayer ark-keep-mt--s`, style: txtLayerStyle },
		{
			template: [['core/paragraph']],
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
			<InspectorControls>
				<SlideSidebar {...{ attributes, setAttributes, clientId }} />
			</InspectorControls>
			<div {...blockProps}>
				<SlideMedia {...{ attributes }} />
				<div className={`${blockName}__colorLayer`} style={colorLayerStyle}></div>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
};
