/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	// BlockControls,
	InspectorControls,
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

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-boxLinks';
const { name, category, keywords, supports } = metadata;

/**
 * アコーディオン
 */
registerBlockType(name, {
	title: __('Box links', 'arkhe-blocks'),
	description: __('', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	attributes: metadata.attributes,
	// example,
	edit: (props) => {
		const { className, attributes, setAttributes } = props;
		const { colPC, colTab, colMobile } = attributes;
		const blockClass = classnames(className, blockName, 'ark-has-guide');

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('READ MORE', 'arkhe-blocks')} initialOpen={true}>
						<RangeControl
							label={__('列数', 'arkhe-blocks') + '(PC)'}
							value={parseInt(colPC)}
							onChange={(val) => {
								setAttributes({ colPC: val + '' });
							}}
							min={1}
							max={4}
						/>
						<RangeControl
							label={__('列数', 'arkhe-blocks') + '(Tab)'}
							value={parseInt(colTab)}
							onChange={(val) => {
								setAttributes({ colTab: val + '' });
							}}
							min={1}
							max={4}
						/>
						<RangeControl
							label={__('列数', 'arkhe-blocks') + '(Mobile)'}
							value={parseInt(colMobile)}
							onChange={(val) => {
								setAttributes({ colMobile: val + '' });
							}}
							min={1}
							max={3}
						/>
					</PanelBody>
				</InspectorControls>
				<Block.div className={blockClass}>
					<InnerBlocks
						allowedBlocks={['arkhe-blocks/box-link']}
						templateLock={false}
						template={[['arkhe-blocks/box-link'], ['arkhe-blocks/box-link']]}
						__experimentalTagName='div'
						__experimentalPassedProps={{
							className: 'c-columns',
							'data-pc-column': colPC,
							'data-tab-column': colTab,
							'data-mb-column': colMobile,
						}}
					/>
				</Block.div>
			</>
		);
	},

	save: ({ attributes }) => {
		const { colPC, colTab, colMobile } = attributes;
		return (
			<div
				className={blockName}
				data-pc-column={colPC}
				data-tab-column={colTab}
				data-column={colMobile}
			>
				<InnerBlocks.Content />
			</div>
		);
	},
});
