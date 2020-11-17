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
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
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
const { name, category, keywords, supports, parent } = metadata;

/**
 * リッチカラム-項目
 */
registerBlockType(name, {
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
		const { className, attributes, setAttributes } = props;
		const { vAlign, widthPC, widthTab, widthMobile } = attributes;

		// 子ブロックの設定
		const blockClass = classnames(className, blockName, 'arkb-columns__item', 'ark-has-guide');

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

				<Block.div
					className={blockClass}
					data-valign={vAlign || null}
					style={columnStyle || null}
				>
					<InnerBlocks
						templateLock={false}
						// template={[['arkhe-blocks/column'], ['arkhe-blocks/column']]}
						__experimentalTagName='div'
						__experimentalPassedProps={{
							className: `${blockName}__body ark-keep-mt--s`,
						}}
					/>
				</Block.div>
			</>
		);
	},
	save: ({ attributes }) => {
		// const blockClass = classnames(`${blockName}`);

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

		return (
			<div
				className={`${blockName} arkb-columns__item`}
				data-valign={vAlign || null}
				style={columnStyle || null}
			>
				<div className={`${blockName}__body ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
