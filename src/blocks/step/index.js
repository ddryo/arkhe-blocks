/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import example from './_example';
import metadata from './block.json';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-step';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * STEPブロック
 */
registerBlockType(name, {
	apiVersion,
	title: __('Step', 'arkhe-blocks'),
	description: __('Create step-by-step content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	example,
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'big', label: __('Big', 'arkhe-blocks') },
		{ name: 'card', label: __('Card', 'arkhe-blocks') },
	],
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes, clientId } = props;

		// デフォルトクラスを強制セット
		// console.log(props.className, attributes.className);
		if (!attributes.className) setAttributes({ className: 'is-style-default' });

		const { stepLabel, startNum } = attributes;

		const { updateBlockAttributes } = useDispatch('core/block-editor');

		// ステップブロック（親）のデータを取得
		const stepBlocksData = useSelect(
			(select) => select('core/block-editor').getBlocksByClientId(clientId)[0],
			[clientId]
		);

		// 始まり番号
		// const startNum = parseInt(attributes.startNum);

		// ブロックProps
		const blockProps = useBlockProps({
			className: `${blockName} ark-has-guide`,
			style: 1 < startNum ? { counterReset: `step ${startNum - 1}` } : null,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['arkhe-blocks/step-item'],
			template: [['arkhe-blocks/step-item'], ['arkhe-blocks/step-item']],
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Step settings', 'arkhe-blocks')}>
						<TextControl
							label={__('Text of "STEP" part', 'arkhe-blocks')}
							value={stepLabel}
							onChange={(val) => {
								setAttributes({ stepLabel: val });

								// 子ブロックにも反映
								stepBlocksData.innerBlocks.forEach((block) => {
									updateBlockAttributes(block.clientId, {
										stepLabel: val,
									});
								});
							}}
						/>

						<TextControl
							label={__('Start number', 'arkhe-blocks')}
							value={startNum}
							type='number'
							onChange={(val) => {
								// typeがnumberなので、intに変換してから保存！
								setAttributes({ startNum: parseInt(val) });
							}}
						/>
						{/* <div className='u-mt-40'></div> */}
					</PanelBody>
				</InspectorControls>
				<div {...innerBlocksProps} />
			</>
		);
	},

	save: ({ attributes }) => {
		const startNum = parseInt(attributes.startNum);

		const blockProps = useBlockProps.save({
			className: `${blockName}`,
			style: 1 < startNum ? { counterReset: `step ${startNum - 1}` } : null,
		});
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
