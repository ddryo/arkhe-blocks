/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	BlockVerticalAlignmentToolbar,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	Tooltip,
	Button,
	BaseControl,
	Flex,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';
import { Icon, mobile, tablet, desktop, link, linkOff } from '@wordpress/icons';

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
 * see: https://github.com/WordPress/gutenberg/blob/899286307b/packages/components/src/box-control/linked-button.js
 */
const LinkedButton = ({ isLinked, ...props }) => {
	const label = isLinked ? __('Unlink Sides') : __('Link Sides');

	return (
		<Tooltip text={label}>
			<span className='__link'>
				<Button
					{...props}
					className='component-box-control__linked-button'
					isPrimary={isLinked}
					isSecondary={!isLinked}
					isSmall
					icon={isLinked ? link : linkOff}
					iconSize={16}
					aria-label={label}
				/>
			</span>
		</Tooltip>
	);
};

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
		const { vAlign, widthPC, widthTab, widthMobile, isBreakAll } = attributes;

		const [isLinked, setIsLinked] = useState(false);

		// 子ブロックの設定
		const blockClass = classnames(
			blockName,
			'arkb-columns__item',
			'ark-keep-mt--s',
			'ark-has-guide',
			{
				'is-breadk-all': isBreakAll,
			}
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
						<BaseControl>
							<BaseControl.VisualLabel>
								<Flex style={{ paddingBottom: '4px' }}>
									<FlexItem style={{ marginRight: 'auto' }}>
										{__('Column width', 'arkhe-blocks') + ' [%]'}
									</FlexItem>
									<FlexItem>
										<LinkedButton
											onClick={() => {
												setIsLinked(!isLinked);
											}}
											isLinked={isLinked}
										/>
									</FlexItem>
								</Flex>
							</BaseControl.VisualLabel>
							<Flex align='flex-start'>
								<FlexItem style={{ marginRight: '4px', marginTop: '4px' }}>
									<Icon icon={desktop} />
								</FlexItem>
								<FlexBlock>
									<RangeControl
										className='arkb-range--useReset -colmun'
										value={widthPC}
										onChange={(val) => {
											if (isLinked) {
												setAttributes({
													widthPC: val,
													widthTab: val,
													widthMobile: val,
												});
											} else {
												setAttributes({ widthPC: val });
											}
										}}
										min={10}
										max={100}
										allowReset={true}
									/>
								</FlexBlock>
							</Flex>
							<Flex align='flex-start'>
								<FlexItem style={{ marginRight: '4px', marginTop: '4px' }}>
									<Icon icon={tablet} />
								</FlexItem>
								<FlexBlock>
									<RangeControl
										className='arkb-range--useReset -colmun'
										value={widthTab}
										onChange={(val) => {
											if (isLinked) {
												setAttributes({
													widthPC: val,
													widthTab: val,
													widthMobile: val,
												});
											} else {
												setAttributes({ widthTab: val });
											}
										}}
										min={10}
										max={100}
										allowReset={true}
									/>
								</FlexBlock>
							</Flex>
							<Flex align='flex-start'>
								<FlexItem style={{ marginRight: '4px', marginTop: '4px' }}>
									<Icon icon={mobile} />
								</FlexItem>
								<FlexBlock>
									<RangeControl
										className='arkb-range--useReset -colmun'
										value={widthMobile}
										onChange={(val) => {
											if (isLinked) {
												setAttributes({
													widthPC: val,
													widthTab: val,
													widthMobile: val,
												});
											} else {
												setAttributes({ widthMobile: val });
											}
										}}
										min={10}
										max={100}
										allowReset={true}
									/>
								</FlexBlock>
							</Flex>
						</BaseControl>
						<ToggleControl
							label={__(
								'Forcibly breaks the character string according to the display range',
								'arkhe-blocks'
							)}
							help={__('"word-break: break-all" is applied.', 'arkhe-blocks')}
							checked={isBreakAll}
							onChange={(val) => {
								setAttributes({ isBreakAll: val });
							}}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...innerBlocksProps} />
			</>
		);
	},
	save: ({ attributes }) => {
		const { vAlign, widthPC, widthTab, widthMobile, isBreakAll } = attributes;

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
			className: classnames(`${blockName} arkb-columns__item ark-keep-mt--s`, {
				'is-breadk-all': isBreakAll,
			}),
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
