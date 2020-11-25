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

import { PanelBody, BaseControl, CheckboxControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

/**
 * @Internal dependencies
 */
import { ArkheIcon, ArkheIconOnSave } from '@components/ArkheIcon';
import ArkheIconPicker from '@components/ArkheIconPicker';
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
const blockName = 'ark-block-timeline';
const { apiVersion, name, category, supports, parent } = metadata;

/**
 * ステップ項目
 */
registerBlockType(name, {
	apiVersion,
	title: __('Timeline item', 'arkhe-blocks'),
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
		const { title, label, isFill, icon, color } = attributes;

		// シェイプクラス
		let shapeClass = `${blockName}__shape`;
		if (isFill) {
			shapeClass += ' -is-fill';
		}
		if (icon) {
			shapeClass += ' -has-icon';
		}

		const shapeStyle = color ? { color } : null;

		// アイコン選択時の処理
		const setIcon = useCallback((val, isSelected) => {
			const newIcon = isSelected ? '' : val;
			setAttributes({ icon: newIcon });
		}, []);

		// Props
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
					<PanelBody title={__('Shape settings', 'arkhe-blocks')}>
						<BaseControl>
							<CheckboxControl
								label={__('Fill the shape', 'arkhe-blocks')}
								checked={isFill}
								onChange={(val) => setAttributes({ isFill: val })}
							/>
						</BaseControl>
						<PanelColorSettings
							title={__('Color settings', 'arkhe-blocks')}
							initialOpen={true}
							colorSettings={[
								{
									value: color,
									label: __('Color', 'arkhe-blocks'),
									onChange: (value) => {
										setAttributes({ color: value });
									},
								},
							]}
						></PanelColorSettings>
					</PanelBody>
					<PanelBody title={__('Icon settings', 'arkhe-blocks')}>
						<ArkheIconPicker icon={icon} setIcon={setIcon} />
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<div className={`${blockName}__head`}>
						<span className={shapeClass} role='presentation' style={shapeStyle}>
							<ArkheIcon icon={icon} className={`${blockName}__icon`} />
						</span>
						<RichText
							placeholder='2020.01.01'
							className={`${blockName}__label`}
							tagName='span'
							value={label}
							onChange={(val) => setAttributes({ label: val })}
						/>
					</div>
					<RichText
						placeholder={__('Enter text', 'arkhe-blocks') + '...'}
						className={`${blockName}__title`}
						tagName='div'
						value={title}
						onChange={(val) => setAttributes({ title: val })}
					/>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { title, label, isFill, icon, color } = attributes;

		let shapeClass = `${blockName}__shape`;
		if (isFill) {
			shapeClass += ' -is-fill';
		}
		if (icon) {
			shapeClass += ' -has-icon';
		}

		const shapeStyle = color ? { color } : null;

		const blockProps = useBlockProps.save({
			className: `${blockName}__item`,
		});

		return (
			<div {...blockProps}>
				<div className={`${blockName}__head`}>
					<span className={shapeClass} role='presentation' style={shapeStyle}>
						<ArkheIconOnSave icon={icon} className={`${blockName}__icon`} />
					</span>
					<span className={`${blockName}__label`}>
						<RichText.Content value={label} />
					</span>
				</div>
				<div className={`${blockName}__title`}>
					<RichText.Content value={title} />
				</div>
				<div className={`${blockName}__body ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
