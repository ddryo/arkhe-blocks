/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	// BlockControls,
	InspectorControls,
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

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-boxLinks';
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
 * アコーディオン
 */
registerBlockType(name, {
	apiVersion,
	title: __('Box links', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	attributes: metadata.attributes,
	example,
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const { colPC, colTab, colMobile } = attributes;
		const blockClass = classnames(blockName, 'arkb-columns', 'ark-has-guide');

		const columnStyle = {
			'--arkb-fb': basisSet[`col${colMobile}`] + '%',
			'--arkb-fb_tab': basisSet[`col${colTab}`] + '%',
			'--arkb-fb_pc': basisSet[`col${colPC}`] + '%',
		};

		const blockProps = useBlockProps({
			className: blockClass,
			style: columnStyle || null,
		});

		// 左右marginの関係でカラムブロックは一つdivかませる
		const innerBlocksProps = useInnerBlocksProps(
			{},
			{
				allowedBlocks: ['arkhe-blocks/box-link'],
				template: [['arkhe-blocks/box-link'], ['arkhe-blocks/box-link']],
				templateLock: false,
				orientation: 'horizontal',
				renderAppender: InnerBlocks.ButtonBlockAppender,
			}
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
						<RangeControl
							label={__('Number of columns', 'arkhe-blocks') + '(PC)'}
							value={parseInt(colPC)}
							onChange={(val) => {
								setAttributes({ colPC: val + '' });
							}}
							min={1}
							max={4}
						/>
						<RangeControl
							label={__('Number of columns', 'arkhe-blocks') + '(Tab)'}
							value={parseInt(colTab)}
							onChange={(val) => {
								setAttributes({ colTab: val + '' });
							}}
							min={1}
							max={4}
						/>
						<RangeControl
							label={__('Number of columns', 'arkhe-blocks') + '(Mobile)'}
							value={parseInt(colMobile)}
							onChange={(val) => {
								setAttributes({ colMobile: val + '' });
							}}
							min={1}
							max={3}
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
		const { colPC, colTab, colMobile } = attributes;

		const columnStyle = {
			'--arkb-fb': basisSet[`col${colMobile}`] + '%',
			'--arkb-fb_tab': basisSet[`col${colTab}`] + '%',
			'--arkb-fb_pc': basisSet[`col${colPC}`] + '%',
		};

		const blockProps = useBlockProps.save({
			className: `${blockName} arkb-columns`,
			style: columnStyle || null,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
