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
	__experimentalBlock as Block,
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
const { name, category, keywords, supports } = metadata;

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
	title: __('Rich columns', 'arkhe-blocks'),
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

		const blockClass = classnames(className, blockName, 'arkb-columns', 'ark-has-guide');

		const columnStyle = {
			'--arkb-fb': basisSet[`col${colMobile}`] + '%',
			'--arkb-fb_tab': basisSet[`col${colTab}`] + '%',
			'--arkb-fb_pc': basisSet[`col${colPC}`] + '%',
		};

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
				<Block.div className={blockClass} data-valign={vAlign || null} style={columnStyle}>
					<InnerBlocks
						allowedBlocks={['arkhe-blocks/column']}
						templateLock={false}
						template={[['arkhe-blocks/column'], ['arkhe-blocks/column']]}
						__experimentalTagName='div'
						// __experimentalPassedProps={{
						// 	className: 'c-boxLink__content ark-keep-mt--s',
						// }}
					/>
				</Block.div>
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

		return (
			<div
				className={`${blockName} arkb-columns`}
				data-valign={vAlign || null}
				style={columnStyle}
			>
				<InnerBlocks.Content />
			</div>
		);
	},
});
