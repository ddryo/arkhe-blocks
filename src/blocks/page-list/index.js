/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import ServerSideRender from '@wordpress/server-side-render';
import { InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	BaseControl,
	RadioControl,
	ButtonGroup,
	Button,
	RangeControl,
} from '@wordpress/components';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import { iconColor } from '@blocks/config';
// import blockIcon from './_icon';
// import example from './_example';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-pageList';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * 設定項目
 */
const targetOptions = [
	{
		label: __('Child page', 'arkhe-blocks'),
		value: 'children',
	},
	{
		label: __('Specify by ID', 'arkhe-blocks'),
		value: 'id',
	},
];

const hTags = [
	{
		label: 'h2',
		val: 'h2',
	},
	{
		label: 'h3',
		val: 'h3',
	},
	{
		label: 'div',
		val: 'div',
	},
];

// 何を基準に並べるか
const orderbyOptions = [
	{
		label: __('"Order" setting', 'arkhe-blocks'),
		value: 'menu_order',
	},
	{
		label: __('Release date', 'arkhe-blocks'),
		value: 'date',
	},
	{
		label: __('Random', 'arkhe-blocks'),
		value: 'rand',
	},
];

const orderOptions = [
	{
		label: __('Ascending order', 'arkhe-blocks'),
		value: 'ASC',
	},
	{
		label: __('Descending order', 'arkhe-blocks'),
		value: 'DESC',
	},
];

/**
 *
 */
registerBlockType(name, {
	apiVersion,
	title: __('Page list', 'arkhe-blocks') + '(β)',
	description: __('Create a page list with the specified conditions.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: 'screenoptions',
	},
	category,
	keywords,
	// example,
	supports,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const { target, postID, hTag, excerptLength, orderby, order } = attributes;

		const blockProps = useBlockProps({
			className: blockName,
		});

		return (
			<>
				<BlockControls>
					<ArkheMarginControl attributes={attributes} setAttributes={setAttributes} />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
						<RadioControl
							label={__('The page you want to display', 'arkhe-blocks')}
							selected={target}
							options={targetOptions}
							onChange={(val) => {
								setAttributes({ target: val });
							}}
						/>
						{'id' === target && (
							<TextControl
								placeholder='ex) 8,120,272'
								help={
									'※ ' +
									__(
										'If there are multiple, enter them separated by ",".',
										'arkhe-blocks'
									)
								}
								value={postID || ''}
								onChange={(value) => {
									setAttributes({ postID: value });
								}}
							/>
						)}
						<RangeControl
							label={__('Number of characters in the excerpt', 'arkhe-blocks')}
							help={__(
								'If "Excerpt" is entered, its contents will be displayed.',
								'arkhe-blocks'
							)}
							value={excerptLength}
							onChange={(val) => {
								setAttributes({ excerptLength: val });
							}}
							min={0}
							max={240}
							allowReset={true}
							className='arkb-range--useReset'
						/>
						<BaseControl>
							<BaseControl.VisualLabel>
								{__('HTML tag for title', 'arkhe-blocks')}
							</BaseControl.VisualLabel>
							<ButtonGroup>
								{hTags.map((btn) => {
									const isSlected = btn.val === hTag;
									return (
										<Button
											// isSecondary={ ! isSlected }
											isPrimary={isSlected}
											onClick={() => {
												setAttributes({ hTag: btn.val });
											}}
											key={`hTag_${btn.val}`}
										>
											{btn.label}
										</Button>
									);
								})}
							</ButtonGroup>
						</BaseControl>
					</PanelBody>
					<PanelBody
						title={__('Sorting order setting', 'arkhe-blocks')}
						initialOpen={true}
					>
						<RadioControl
							label={__('What to arrange based on', 'arkhe-blocks')} //'何を基準に並べるか'
							selected={orderby}
							options={orderbyOptions}
							onChange={(val) => {
								setAttributes({ orderby: val });
							}}
						/>
						<RadioControl
							label={__('Descending or Ascending', 'arkhe-blocks')} // '降順か昇順か'
							selected={order}
							options={orderOptions}
							onChange={(val) => {
								setAttributes({ order: val });
							}}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<ServerSideRender block={name} attributes={attributes} />
				</div>
			</>
		);
	},
	save: () => {
		return null;
	},
});
