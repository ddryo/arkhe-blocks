/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	PanelBody,
	RangeControl,
	BaseControl,
	Flex,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';
import { Icon, mobile, tablet, desktop } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
import deprecated from './deprecated';
import { ArkheMarginControl } from '@components/ArkheMarginControl';
import getColumnBasis from '@helper/getColumnBasis';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * registerBlockType
 */
const blockName = 'ark-block-boxLinks';
const { apiVersion, name, category, keywords, supports } = metadata;

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
			'--arkb-fb': '1' !== colMobile ? getColumnBasis(colMobile) : null,
			'--arkb-fb_tab': '2' !== colTab ? getColumnBasis(colTab) : null,
			'--arkb-fb_pc': '2' !== colPC ? getColumnBasis(colPC) : null,
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
				<BlockControls>
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
						<BaseControl>
							<BaseControl.VisualLabel>
								{__('Number of columns', 'arkhe-blocks')}
							</BaseControl.VisualLabel>
							<Flex>
								<FlexItem style={{ marginRight: '4px', marginBottom: '8px' }}>
									<Icon icon={desktop} />
								</FlexItem>
								<FlexBlock>
									<RangeControl
										value={parseInt(colPC)}
										onChange={(val) => {
											setAttributes({ colPC: val + '' });
										}}
										min={1}
										max={4}
									/>
								</FlexBlock>
							</Flex>
							<Flex>
								<FlexItem style={{ marginRight: '4px', marginBottom: '8px' }}>
									<Icon icon={tablet} />
								</FlexItem>
								<FlexBlock>
									<RangeControl
										value={parseInt(colTab)}
										onChange={(val) => {
											setAttributes({ colTab: val + '' });
										}}
										min={1}
										max={4}
									/>
								</FlexBlock>
							</Flex>
							<Flex>
								<FlexItem style={{ marginRight: '4px', marginBottom: '8px' }}>
									<Icon icon={mobile} />
								</FlexItem>
								<FlexBlock>
									<RangeControl
										value={parseInt(colMobile)}
										onChange={(val) => {
											setAttributes({ colMobile: val + '' });
										}}
										min={1}
										max={3}
									/>
								</FlexBlock>
							</Flex>
						</BaseControl>
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
			'--arkb-fb': '1' !== colMobile ? getColumnBasis(colMobile) : null,
			'--arkb-fb_tab': '2' !== colTab ? getColumnBasis(colTab) : null,
			'--arkb-fb_pc': '2' !== colPC ? getColumnBasis(colPC) : null,
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
	deprecated,
});
