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

/**
 * @others dependencies
 */
import classnames from 'classnames';

/**
 * @FontAwesome dependencies
 */
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(fas);
dom.watch();

/**
 * 普通のアイコンと fontawesome を分けるための関数
 */
const sliceIconData = (iconClass) => {
	let iconData;

	// FAだったら配列が返される
	if (null !== iconClass.match(/fas |fab |far /)) {
		iconData = iconClass.split(' ');
		iconData[1] = iconData[1].replace('fa-', '');
		return iconData;
	}

	// FA以外は普通に文字列のまま
	return iconClass;
};

/**
 * metadata
 */
const blockName = 'ark-block-notice';
const { name, category, keywords, supports } = metadata;

/**
 * 通知ブロック
 */
registerBlockType(name, {
	title: __('Notice', 'arkhe-blocks'), // 通知
	description: __('Notify users by emphasizing content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'big', label: __('Big', 'arkhe-blocks') },
		{ name: 'left', label: '左アイコン' },
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

		// アイコン
		let iconSrc = null;
		if (icon) {
			const iconData = sliceIconData(icon);
			if (typeof iconData === 'string') {
				iconSrc = <i className={`${blockName}__icon ${icon}`}></i>;
			} else {
				iconSrc = <FontAwesomeIcon icon={iconData} className={`${blockName}__icon`} />;
			}
		}

		return (
			<>
				<BlockControls {...props} />
				<Block.div className={blockClass}>
					<div className={`${blockName}__head`}>
						{iconSrc}
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
		let blockClass = blockName;
		if (type) {
			blockClass = classnames(blockClass, '-' + type);
		}
		const { icon, title, type } = attributes;

		// アイコン
		let iconSrc = null;
		if (icon) {
			const iconData = sliceIconData(icon);
			if (typeof iconData === 'string') {
				iconSrc = <i className={`${blockName}__icon ${icon}`}></i>;
			} else {
				iconSrc = <FontAwesomeIcon icon={iconData} className={`${blockName}__icon`} />;
			}
		}

		return (
			<div className={blockClass}>
				<div className={`${blockName}__head`}>
					{iconSrc}
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
