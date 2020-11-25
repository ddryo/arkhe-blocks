/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	InnerBlocks,
	PanelColorSettings,
	InspectorControls,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl, BaseControl, CheckboxControl } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import metadata from './block.json';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-step';
const { apiVersion, name, category, supports, parent } = metadata;

/**
 * ステップ項目
 */
registerBlockType(name, {
	apiVersion,
	title: __('Step item', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,

	edit: (props) => {
		const { attributes, setAttributes } = props;
		const { title, numColor, stepLabel, theLabel, theNum, isHideLabel, isHideNum } = attributes;

		// ステップ番号の色設定
		let numStyle = null;
		let numClass = `${blockName}__number`;
		if (numColor) {
			numStyle = { '--ark-step_color': numColor };
			numClass += ' -has-color';
		}

		const thisStepLabel = isHideLabel ? '' : theLabel || stepLabel;
		const thisStepNum = isHideNum ? '' : theNum || null;

		const blockProps = useBlockProps({
			className: `${blockName}__item`,
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
				<InspectorControls>
					<PanelBody title={__('Text settings', 'arkhe-blocks')}>
						<BaseControl>
							<CheckboxControl
								label={__('Hide the number', 'arkhe-blocks')}
								checked={isHideNum}
								onChange={(val) => setAttributes({ isHideNum: val })}
							/>
						</BaseControl>
						<TextControl
							label={__('Number part text', 'arkhe-blocks')}
							value={theNum}
							onChange={(val) => {
								setAttributes({ theNum: val });
							}}
						/>
						<BaseControl>
							<CheckboxControl
								label={__('Hide the text', 'arkhe-blocks')}
								checked={isHideLabel}
								onChange={(val) => setAttributes({ isHideLabel: val })}
							/>
						</BaseControl>
						<TextControl
							label={__('Text of "STEP" part', 'arkhe-blocks')}
							value={theLabel}
							onChange={(val) => {
								setAttributes({ theLabel: val });
							}}
						/>
					</PanelBody>
					<PanelColorSettings
						title={__('Color settings', 'arkhe-blocks')}
						initialOpen={true}
						colorSettings={[
							{
								value: numColor,
								label: __('Color', 'arkhe-blocks'),
								onChange: (value) => {
									setAttributes({ numColor: value });
								},
							},
						]}
					></PanelColorSettings>
				</InspectorControls>
				<div {...blockProps}>
					<div className={`${blockName}__head`}>
						<div className={`${numClass}`} style={numStyle} data-num={thisStepNum}>
							{thisStepLabel ? (
								<span className='__label'>{thisStepLabel}</span>
							) : null}
						</div>
						<RichText
							placeholder={__('Enter text', 'arkhe-blocks') + '...'}
							className={`${blockName}__title`}
							tagName='div'
							value={title}
							onChange={(val) => setAttributes({ title: val })}
						/>
					</div>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { title, numColor, stepLabel, theLabel, theNum, isHideLabel, isHideNum } = attributes;

		// ステップ番号の色設定
		let numStyle = null;
		let numClass = `${blockName}__number`;
		if (numColor) {
			numStyle = { '--ark-step_color': numColor };
			numClass += ' -has-color';
		}

		const thisStepLabel = isHideLabel ? '' : theLabel || stepLabel;
		const thisStepNum = isHideNum ? '' : theNum || null;

		const blockProps = useBlockProps.save({
			className: `${blockName}__item`,
		});

		return (
			<div {...blockProps}>
				<div className={`${blockName}__head`}>
					<div className={`${numClass}`} style={numStyle} data-num={thisStepNum}>
						{thisStepLabel ? <span className='__label'>{thisStepLabel}</span> : null}
					</div>

					{!!title && (
						<div className={`${blockName}__title`}>
							<RichText.Content value={title} />
						</div>
					)}
				</div>
				<div className={`${blockName}__body ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
