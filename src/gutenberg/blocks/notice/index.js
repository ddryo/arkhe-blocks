/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	RichText,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';
import { PanelBody, ButtonGroup, Button } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import deprecated from './deprecated';
import blockIcon from './_icon';
import example from './_example';
import ArkheIconPicker from '@components/ArkheIconPicker';
import { iconColor } from '@blocks/config';
import { ArkheIcon } from '@components/ArkheIcon';
import { ArkheSVG } from '@components/ArkheSVG';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * style
 */
import './scss/index.scss';

/**
 * 設定
 */
const types = [
	{
		value: 'point',
		icon: 'arkb-svg-point',
	},
	{
		value: 'alert',
		icon: 'arkb-svg-alert',
	},
	{
		value: 'warning',
		icon: 'arkb-svg-warning',
	},
	{
		value: 'ok',
		icon: 'arkb-svg-check',
	},
	{
		value: 'memo',
		icon: 'arkb-svg-pen',
	},
];

/**
 * 通知ブロック
 */
const blockName = 'ark-block-notice';
registerBlockType(metadata.name, {
	title: __('Notice', 'arkhe-blocks'),
	description: __('Create content that is prominently emphasized.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'stronger', label: __('Stronger', 'arkhe-blocks') },
		{ name: 'simple', label: __('Simple', 'arkhe-blocks') },
	],
	attributes: metadata.attributes,
	example,
	transforms: {
		from: [
			//どのブロックタイプから変更できるようにするか
			{
				type: 'block',
				blocks: ['core/paragraph'],
				transform: (attributes) => {
					const innerP = createBlock('core/paragraph', {
						content: attributes.content,
					});
					return createBlock(metadata.name, { className: 'is-style-simple' }, [innerP]);
				},
			},
		],
	},
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const { type, icon, title } = attributes;

		let blockClass = blockName;
		if (type) {
			blockClass = `${blockClass} -${type}`;
		}

		// アイコン選択時の処理
		const setIcon = useCallback((val, isSelected = false) => {
			const newIcon = isSelected ? '' : val;
			setAttributes({ icon: newIcon });
		}, []);

		// Props
		const blockProps = useBlockProps({
			className: blockClass,
		});
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__body ark-keep-mt--s`,
			},
			{
				template: [['core/paragraph']],
				templateLock: false,
			}
		);

		return (
			<>
				<BlockControls>
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Notification type', 'arkhe-blocks')} initialOpen={true}>
						<ButtonGroup className='arkb-btns--notice'>
							{types.map((data) => {
								return (
									<Button
										isPrimary={type === data.value}
										key={`ark-${data.value}`}
										className={`ark-block-notice -${data.value}`}
										onClick={() => {
											setAttributes({
												type: data.value,
												icon: data.icon,
											});
										}}
									>
										<ArkheSVG icon={data.icon} size='20' />
									</Button>
								);
							})}
						</ButtonGroup>
					</PanelBody>
					<PanelBody title={__('Icon settings', 'arkhe-blocks')} initialOpen={true}>
						<ArkheIconPicker icon={icon} setIcon={setIcon} />
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<div className={`${blockName}__head`}>
						<ArkheIcon icon={icon} className={`${blockName}__icon`} size='20' />
						<RichText
							tagName='span'
							className={`${blockName}__title`}
							placeholder={__('Enter text', 'arkhe-blocks') + '...'}
							value={title}
							onChange={(newTitle) => setAttributes({ title: newTitle })}
						/>
					</div>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const { icon, title, type } = attributes;

		let blockClass = blockName;
		if (type) {
			blockClass = `${blockClass} -${type}`;
		}

		const blockProps = useBlockProps.save({
			className: blockClass,
		});

		const attrClass = attributes.className || '';
		const isSimpleStyle = -1 !== attrClass.indexOf('is-style-simple');

		return (
			<div {...blockProps}>
				<div className={`${blockName}__head`}>
					<ArkheIcon icon={icon} className={`${blockName}__icon`} size='20' />
					{!isSimpleStyle && (
						<RichText.Content
							tagName='span'
							className={`${blockName}__title`}
							value={title}
						/>
					)}
				</div>
				<div className={`${blockName}__body ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
	deprecated,
});
