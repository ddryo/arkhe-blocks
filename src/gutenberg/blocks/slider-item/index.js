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
import SlideEdit from './block.json';
import SlideSidebar from './_sidebar';
import { SlideMedia } from './components/SlideMedia';
import { getPositionClassName } from '@helper/getPositionClassName';
import { MediaEdit, RichEdit } from './edit';

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

	edit: (props) => {
		const { attributes, setAttributes, clientId } = props;
		if ('media' === attributes.variation) {
			return <MediaEdit {...{ attributes, setAttributes, clientId }} />;
		}
		return <RichEdit {...{ attributes, setAttributes, clientId }} />;
	},

	save: () => {
		return <InnerBlocks.Content />;
	},
});
