/**
 * @WordPress dependencies
 */
// https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/rich-text/README.md
import { __ } from '@wordpress/i18n';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import { useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	BlockControls,
	RichText,
	AlignmentToolbar,
	InspectorControls,
	useBlockProps,
	ColorPalette,
	getColorObjectByColorValue,
} from '@wordpress/block-editor';
// import { useCallback } from '@wordpress/element';
import {
	PanelBody,
	BaseControl,
	RadioControl,
	ToggleControl,
	// ButtonGroup,
	// Button,
	ToolbarGroup,
} from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
import HeadingLevelDropdown from './components/heading-level-dropdown';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-heading';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * 設定項目
 */
const subPositions = [
	{
		label: __('Top', 'arkhe-blocks'),
		value: 'top',
	},
	{
		label: __('Bottom', 'arkhe-blocks'),
		value: 'bottom',
	},
];

/**
 * 通知ブロック
 */
registerBlockType(name, {
	apiVersion,
	title: __('Section Heading', 'arkhe-blocks'),
	// description: __('Create content that is prominently emphasized.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	// styles: [],
	attributes: metadata.attributes,
	example,
	transforms: {
		from: [
			//どのブロックタイプから変更できるようにするか
			{
				type: 'block',
				blocks: ['core/paragraph'],
				transform: (attributes) => {
					return createBlock(name, { content: attributes.content });
				},
			},
		],
	},
	merge(attributes, attributesToMerge) {
		// console.log(attributes, attributesToMerge);
		return {
			content: (attributes.content || '') + (attributesToMerge.content || ''),
		};
	},

	edit: ({ attributes, setAttributes, mergeBlocks, onReplace }) => {
		const {
			textAlign,
			content,
			level,
			subContent,
			subPosition,
			color,
			colorSlug,
			lineColor,
			lineColorSlug,
			useLine,
		} = attributes;

		// 見出しのタグ
		const tagName = 'h' + level;

		// カラーパレットの設定を取得
		const { paletteColors } = useSelect((select) => {
			const blockEditorSelect = select('core/block-editor');
			let settings;
			if (blockEditorSelect && blockEditorSelect.getSettings) {
				settings = blockEditorSelect.getSettings();
			} else {
				settings = {};
			}
			return {
				colors: settings.colors || [],
				// disableCustomColors: settings.disableCustomColors,
			};
		});

		// カラー設定の onChange
		const onColorChange = useCallback(
			(newColor, colorAttr, colorSlugAttr) => {
				if (newColor) {
					const colorObject = getColorObjectByColorValue(paletteColors, newColor);
					// console.log(colorObject);
					const newColorSlug = colorObject?.slug || undefined;
					setAttributes({ [colorAttr]: newColor, [colorSlugAttr]: newColorSlug });
				} else {
					setAttributes({ [colorAttr]: undefined, [colorSlugAttr]: undefined });
				}
			},
			[paletteColors]
		);

		// ブロックstyle
		const blockStyle = {};
		if (!colorSlug) {
			blockStyle.color = color;
		}

		// ブロックprops
		const blockProps = useBlockProps({
			className: classnames(`${blockName}`, {
				[`has-text-align-${textAlign}`]: textAlign && 'center' !== textAlign,
				'has-text-color': !!color,
				[`has-${colorSlug}-color`]: !!colorSlug,
			}),
			'data-sub': subPosition,
			style: blockStyle || null,
		});

		// サブテキストclass
		const subTextClass = classnames(`${blockName}__sub`, {
			'is-empty': RichText.isEmpty(subContent),
		});

		// ラインstyle
		const lineStyle = {};
		if (!lineColorSlug) {
			lineStyle.color = lineColor;
		}

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<HeadingLevelDropdown
							selectedLevel={level}
							onChange={(newLevel) => setAttributes({ level: newLevel })}
						/>
					</ToolbarGroup>
					<AlignmentToolbar
						value={textAlign || 'center'}
						onChange={(nextAlign) => {
							setAttributes({ textAlign: nextAlign });
						}}
					/>
					<ArkheMarginControl attributes={attributes} setAttributes={setAttributes} />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
						<RadioControl
							label={__('Subtext position', 'arkhe-blocks')}
							selected={subPosition}
							options={subPositions}
							onChange={(val) => {
								setAttributes({ subPosition: val });
							}}
						/>
						<ToggleControl
							label={__('Show line', 'arkhe-blocks')}
							checked={useLine}
							onChange={(value) => {
								setAttributes({ useLine: value });
							}}
						/>
					</PanelBody>
					<PanelBody title={__('Color settings', 'arkhe-blocks')} initialOpen={true}>
						<BaseControl>
							<BaseControl.VisualLabel>
								{__('Text Color', 'arkhe-blocks')}
							</BaseControl.VisualLabel>
							<ColorPalette
								value={color}
								onChange={(newColor) => {
									onColorChange(newColor, 'color', 'colorSlug');
								}}
							/>
						</BaseControl>
						<BaseControl>
							<BaseControl.VisualLabel>
								{__('Line Color', 'arkhe-blocks')}
							</BaseControl.VisualLabel>
							<ColorPalette
								value={lineColor}
								onChange={(newColor) => {
									onColorChange(newColor, 'lineColor', 'lineColorSlug');
								}}
							/>
						</BaseControl>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					{'top' === subPosition && (
						<RichText
							tagName={'div'}
							className={subTextClass}
							value={subContent}
							onChange={(value) => setAttributes({ subContent: value })}
							placeholder={__('Write sub title…', 'arkhe-blocks')}
							textAlign={textAlign}
						/>
					)}
					<RichText
						identifier='content'
						tagName={tagName}
						className={`${blockName}__main`}
						value={content}
						onChange={(value) => setAttributes({ content: value })}
						onMerge={mergeBlocks}
						onSplit={(value) => {
							// console.log(value);
							if (!value) {
								return createBlock('core/paragraph');
							}
							return createBlock(name, {
								...attributes,
								content: value,
							});
						}}
						onReplace={onReplace}
						onRemove={() => onReplace([])}
						placeholder={__('Write heading…')}
						textAlign={textAlign}
					/>
					{useLine && (
						<span
							className={classnames(`${blockName}__line`, {
								'has-text-color': !!lineColor,
								[`has-${lineColorSlug}-color`]: !!lineColorSlug,
							})}
							style={lineStyle || null}
						></span>
					)}
					{'bottom' === subPosition && (
						<RichText
							tagName={'div'}
							className={subTextClass}
							value={subContent}
							onChange={(value) => setAttributes({ subContent: value })}
							placeholder={__('Write sub title…', 'arkhe-blocks')}
							textAlign={textAlign}
						/>
					)}
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			textAlign,
			content,
			level,
			subContent,
			subPosition,
			useLine,
			color,
			colorSlug,
			lineColor,
			lineColorSlug,
		} = attributes;

		// 見出しタグ
		const TagName = 'h' + level;

		// ブロックstyle
		const blockStyle = {};
		if (!colorSlug) {
			blockStyle.color = color;
		}

		// ブロックprops
		const blockProps = useBlockProps.save({
			className: classnames(`${blockName}`, {
				[`has-text-align-${textAlign}`]: textAlign && 'center' !== textAlign,
				'has-text-color': !!color,
				[`has-${colorSlug}-color`]: !!colorSlug,
			}),
			'data-sub': subPosition,
			style: blockStyle || null,
		});

		const subTextClass = `${blockName}__sub`;

		// ラインstyle
		const lineStyle = {};
		if (!lineColorSlug) {
			lineStyle.color = lineColor;
		}

		return (
			<div {...blockProps}>
				{'top' === subPosition && (
					<div className={subTextClass}>
						<RichText.Content value={subContent} />
					</div>
				)}
				<TagName className={`${blockName}__main`}>
					<RichText.Content value={content} />
				</TagName>
				{useLine && (
					<span
						className={classnames(`${blockName}__line`, {
							'has-text-color': !!lineColor,
							[`has-${lineColorSlug}-color`]: !!lineColorSlug,
						})}
						style={lineStyle || null}
					></span>
				)}
				{'bottom' === subPosition && (
					<div className={subTextClass}>
						<RichText.Content value={subContent} />
					</div>
				)}
			</div>
		);
	},
});
