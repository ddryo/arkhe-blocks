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
import metadata from './block.json';
import blockIcon from './_icon';
import { iconColor } from '@blocks/config';

/**
 * タブ項目
 */
registerBlockType(metadata.name, {
	title: __('Tab content', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	attributes: metadata.attributes,
	edit: () => {
		const blockProps = useBlockProps({
			className: 'arkb-tabBody__content ark-keep-mt--s',
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
			className: 'arkb-tabBody__content ark-keep-mt--s',
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
