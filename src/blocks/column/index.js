/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	BlockVerticalAlignmentToolbar,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
	PanelBody,
	// Button,
	// ButtonGroup,
	// BaseControl,
	// TextControl,
	RangeControl,
} from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
// import ColumnsItemControl from './ColumnsItemControl';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-column';
const { apiVersion, name, category, keywords, supports, parent } = metadata;

/**
 * リッチカラム-項目
 */
registerBlockType(name, {
	apiVersion,
	title: __('Column item', 'arkhe-blocks'), //'自由項目',
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	parent,
	supports,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes, clientId } = props;
		const { vAlign, widthPC, widthTab, widthMobile } = attributes;

		// 子ブロックの設定
		const blockClass = classnames(
			blockName,
			'arkb-columns__item',
			'ark-keep-mt--s',
			'ark-has-guide'
		);

		const columnStyle = {};
		if (widthMobile) {
			columnStyle['--arkb-fb'] = widthMobile + '%';
		}
		if (widthTab) {
			columnStyle['--arkb-fb_tab'] = widthTab + '%';
		}
		if (widthPC) {
			columnStyle['--arkb-fb_pc'] = widthPC + '%';
		}

		const hasChildBlocks = useSelect(
			(select) => {
				const { getBlockOrder } = select('core/block-editor');
				return getBlockOrder(clientId).length > 0;
			},
			[clientId]
		);

		const blockProps = useBlockProps({
			className: blockClass,
			'data-valign': vAlign || null,
			style: columnStyle || null,
		});
		// className: `${blockName}__body ark-keep-mt--s`,
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			templateLock: false,
			renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
		});

		return (
			<>
				<BlockControls>
					<BlockVerticalAlignmentToolbar
						onChange={(value) => {
							setAttributes({ vAlign: value });
						}}
						value={vAlign}
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')}>
						<RangeControl
							label={__('Column width', 'arkhe-blocks') + ' [%] (PC)'}
							value={widthPC}
							onChange={(val) => {
								setAttributes({ widthPC: val });
							}}
							min={10}
							max={100}
						/>
						<RangeControl
							label={__('Column width', 'arkhe-blocks') + ' [%] (Tab)'}
							value={widthTab}
							onChange={(val) => {
								setAttributes({ widthTab: val });
							}}
							min={10}
							max={100}
						/>
						<RangeControl
							label={__('Column width', 'arkhe-blocks') + ' [%] (Mobile)'}
							value={widthMobile}
							onChange={(val) => {
								setAttributes({ widthMobile: val });
							}}
							min={10}
							max={100}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...innerBlocksProps} />
			</>
		);
	},
	save: ({ attributes }) => {
		const { vAlign, widthPC, widthTab, widthMobile } = attributes;

		const columnStyle = {};
		if (widthMobile) {
			columnStyle['--arkb-fb'] = widthMobile + '%';
		}
		if (widthTab) {
			columnStyle['--arkb-fb_tab'] = widthTab + '%';
		}
		if (widthPC) {
			columnStyle['--arkb-fb_pc'] = widthPC + '%';
		}

		const blockProps = useBlockProps.save({
			className: `${blockName} arkb-columns__item ark-keep-mt--s`,
			'data-valign': vAlign || null,
			style: columnStyle || null,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
