/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import metadata from './block.json';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-tab';
const { apiVersion, name, category, supports, parent } = metadata;

/**
 * ステップ項目
 */
registerBlockType(name, {
	apiVersion,
	title: __('Tab content', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,

	edit: () => {
		const blockProps = useBlockProps({
			className: 'arkb-tabBody__content',
		});

		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			template: [['core/paragraph']],
			templateLock: false,
		});

		return <div {...innerBlocksProps} />;
	},

	save: ({ attributes }) => {
		const { tabId, bodyId, activeTab } = attributes;

		const blockProps = useBlockProps.save({
			className: 'arkb-tabBody__content',
			id: `tab-${tabId}-${bodyId}`,
			role: 'tabpanel',
			'aria-hidden': activeTab === bodyId ? 'false' : 'true',
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
