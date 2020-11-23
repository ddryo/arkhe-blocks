/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InspectorControls,
	BlockVerticalAlignmentToolbar,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
// import ColumnsControl from './ColumnsControl';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-columns';
const { apiVersion, name, category, keywords, supports } = metadata;

const basisSet = {
	col1: 100,
	col2: 50,
	col3: 33.33,
	col4: 25,
	col5: 20,
	col6: 16.66,
};

/**
 * リッチカラム
 */
registerBlockType(name, {
	apiVersion,
	title: __('Rich columns', 'arkhe-blocks') + '(β)',
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'shadow', label: _x('Shadow', 'style', 'arkhe-blocks') },
	],
	example,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes, className } = props;
		const { vAlign, colPC, colTab, colMobile } = attributes;

		// console.log(attributes.tagName);

		const blockClass = classnames(className, blockName, 'arkb-columns', 'ark-has-guide');

		const columnStyle = {
			'--arkb-fb': basisSet[`col${colMobile}`] + '%',
			'--arkb-fb_tab': basisSet[`col${colTab}`] + '%',
			'--arkb-fb_pc': basisSet[`col${colPC}`] + '%',
		};

		const blockProps = useBlockProps({
			className: blockClass,
			style: columnStyle,
			'data-valign': vAlign || null,
			'data-col': colMobile,
			'data-col-tab': colTab,
			'data-col-pc': colPC,
		});

		// 左右marginの関係でカラムブロックは一つdivかませる
		const innerBlocksProps = useInnerBlocksProps(
			{
				// className: '',
			},
			{
				allowedBlocks: ['arkhe-blocks/column'],
				template: [['arkhe-blocks/column'], ['arkhe-blocks/column']],
				templateLock: false,
				orientation: 'horizontal',
				renderAppender: InnerBlocks.ButtonBlockAppender,
			}
		);

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
					<PanelBody title='カラム設定'>
						<RangeControl
							label={__('Number of columns', 'arkhe-blocks') + '(PC)'}
							value={colPC}
							onChange={(val) => {
								setAttributes({ colPC: val });
							}}
							min={1}
							max={6}
						/>
						<RangeControl
							label={__('Number of columns', 'arkhe-blocks') + '(Tab)'}
							value={colTab}
							onChange={(val) => {
								setAttributes({ colTab: val });
							}}
							min={1}
							max={4}
						/>
						<RangeControl
							label={__('Number of columns', 'arkhe-blocks') + '(Mobile)'}
							value={colMobile}
							onChange={(val) => {
								setAttributes({ colMobile: val });
							}}
							min={1}
							max={4}
						/>
					</PanelBody>
				</InspectorControls>
				{/* 左右marginの関係でカラムブロックは一つdivかませる */}
				<div {...blockProps}>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const { vAlign, colPC, colTab, colMobile } = attributes;
		const columnStyle = {
			'--arkb-fb': basisSet[`col${colMobile}`] + '%',
			'--arkb-fb_tab': basisSet[`col${colTab}`] + '%',
			'--arkb-fb_pc': basisSet[`col${colPC}`] + '%',
		};

		const blockProps = useBlockProps.save({
			className: `${blockName} arkb-columns`,
			style: columnStyle,
			'data-valign': vAlign || null,
			'data-col': colMobile,
			'data-col-tab': colTab,
			'data-col-pc': colPC,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
