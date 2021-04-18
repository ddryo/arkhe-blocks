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
import { UnitNumber } from '@components/UnitNumber';

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
		const { attributes, setAttributes } = props;
		const { vAlign, colPC, colTab, colMobile, margin } = attributes;

		const blockProps = useBlockProps({
			className: classnames(blockName, 'arkb-columns', 'ark-has-guide'),
			style: {
				'--arkb-fb': '1' !== colMobile ? basisSet[`col${colMobile}`] + '%' : null,
				'--arkb-fb_tab': '2' !== colTab ? basisSet[`col${colTab}`] + '%' : null,
				'--arkb-fb_pc': '2' !== colPC ? basisSet[`col${colPC}`] + '%' : null,
				'--arkb-clmn-mrgn--x': '0.75rem' !== margin.x ? margin.x : null,
				'--arkb-clmn-mrgn--bttm': '1.5rem' !== margin.bottom ? margin.bottom : null,
			},
			'data-valign': vAlign || null,
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
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Columns Settings', 'arkhe-blocks')}>
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
										max={8}
										icon={<Icon icon={desktop} />}
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
										max={8}
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
										max={6}
									/>
								</FlexBlock>
							</Flex>
						</BaseControl>
					</PanelBody>
					<PanelBody title={__('Margin Settings', 'arkhe-blocks')}>
						<Flex>
							<FlexItem style={{ minWidth: '2.5em' }}>
								{__('左右', 'arkhe-blocks')}
							</FlexItem>
							<FlexBlock>
								<UnitNumber
									value={margin.x}
									onChange={(newVal) => {
										setAttributes({ margin: { ...margin, x: newVal } });
									}}
								/>
							</FlexBlock>
						</Flex>
						<Flex style={{ marginTop: '8px' }}>
							<FlexItem style={{ minWidth: '2.5em' }}>
								{__('下', 'arkhe-blocks')}
							</FlexItem>
							<FlexBlock>
								<UnitNumber
									value={margin.bottom}
									onChange={(newVal) => {
										setAttributes({ margin: { ...margin, bottom: newVal } });
									}}
								/>
							</FlexBlock>
						</Flex>
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
		const { vAlign, colPC, colTab, colMobile, margin } = attributes;
		const blockProps = useBlockProps.save({
			className: `${blockName} arkb-columns`,
			style: {
				'--arkb-fb': '1' !== colMobile ? basisSet[`col${colMobile}`] + '%' : null,
				'--arkb-fb_tab': '2' !== colTab ? basisSet[`col${colTab}`] + '%' : null,
				'--arkb-fb_pc': '2' !== colPC ? basisSet[`col${colPC}`] + '%' : null,
				'--arkb-clmn-mrgn--x': '0.75rem' !== margin.x ? margin.x : null,
				'--arkb-clmn-mrgn--bttm': '1.5rem' !== margin.bottom ? margin.bottom : null,
			},
			'data-valign': vAlign || null,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
	deprecated,
});
