/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InnerBlocks, __experimentalBlock as Block } from '@wordpress/block-editor';
// import { PanelBody, RadioControl } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
import BlockControls from './_controls';
import example from './_example';
import { ArkheIcon } from '@components/ArkheIcon';

/**
 * @others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-notice';
const { name, category, keywords, supports } = metadata;

/**
 * 通知ブロック
 */
registerBlockType(name, {
	title: __('Notice', 'arkhe-blocks'),
	description: __('Create content that is prominently emphasized.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'stronger', label: __('Stronger', 'arkhe-blocks') },
		{ name: 'simple', label: __('Simple', 'arkhe-blocks') },
	],
	attributes: {
		title: {
			type: 'array',
			source: 'children',
			selector: '.ark-block-notice__title',
			default: '',
		},
		type: {
			type: 'string',
			default: 'memo',
		},
		icon: {
			type: 'string',
			default: 'fas fa-pen',
		},
	},
	example,
	edit: (props) => {
		const { attributes, className, setAttributes } = props;
		const { type, icon, title } = attributes;

		let blockClass = classnames(blockName, className);
		if (type) {
			blockClass = classnames(blockClass, '-' + type);
		}

		return (
			<>
				<BlockControls {...props} />
				<Block.div className={blockClass}>
					<div className={`${blockName}__head`}>
						<ArkheIcon icon={icon} className={`${blockName}__icon`} />
						<RichText
							tagName='span'
							className={`${blockName}__title`}
							placeholder={__('Enter text', 'arkhe-blocks') + '...'}
							value={title}
							onChange={(newTitle) => setAttributes({ title: newTitle })}
						/>
					</div>
					<div className={`${blockName}__body`}>
						<InnerBlocks
							__experimentalTagName='div'
							__experimentalPassedProps={{
								className: 'ark-keep-mt--s',
							}}
						/>
					</div>
				</Block.div>
			</>
		);
	},

	save: ({ attributes }) => {
		const { icon, title, type } = attributes;

		let blockClass = blockName;
		if (type) {
			blockClass = classnames(blockClass, '-' + type);
		}

		return (
			<div className={blockClass}>
				<div className={`${blockName}__head`}>
					<ArkheIcon icon={icon} className={`${blockName}__icon`} />
					<RichText.Content
						tagName='span'
						className={`${blockName}__title`}
						value={title}
					/>
				</div>
				<div className={`${blockName}__body ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
