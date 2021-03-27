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
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import metadata from './block.json';
import SlideSidebar from './_sidebar';
import { SlideMedia } from './components/SlideMedia';
import { getPositionClassName } from '@helper/getPositionClassName';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const { apiVersion, name, category, supports, parent } = metadata;

// https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/columns/variations.js

/**
 * スライド
 */
const blockName = 'ark-block-slider';
registerBlockType(name, {
	apiVersion,
	title: __('Slider content', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,

	edit: ({ attributes, setAttributes, clientId }) => {
		const {
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
		const blockClass = classnames(`${blockName}__slide`, positionClass);

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
					{/* {contentPosition && (
						<ToolbarGroup>
							<ToolbarButton
								className='components-toolbar__control'
								label={__('Delete position', 'arkhe-blocks')}
								icon={blockIcon.removePosition}
								// icon={<Icon icon={cancelCircleFilled} />}
								onClick={() => {
									setAttributes({ contentPosition: 'center center' });
								}}
							/>
						</ToolbarGroup>
					)} */}
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
	},

	save: () => {
		return <InnerBlocks.Content />;
	},
});
