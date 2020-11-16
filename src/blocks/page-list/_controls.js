/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	BaseControl,
	// CheckboxControl,
	RadioControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';

// import { useSelect } from '@wordpress/data';

/**
 * @Internal dependencies
 */

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

export default function (props) {
	const { attributes, setAttributes } = props;

	const { target, postID, hTag, excerptLength, orderby, order } = attributes;

	// リストタイプ
	const targetOptions = [
		{
			label: __('Children', 'arkhe-blocks'),
			value: 'children',
		},
		{
			label: __('ID', 'arkhe-blocks'),
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

	return (
		<InspectorControls>
			<PanelBody title={__('Display settings', 'arkhe-blocks')} initialOpen={true}>
				<RadioControl
					label={__('ターゲット', 'arkhe-blocks')}
					selected={target}
					options={targetOptions}
					onChange={(val) => {
						setAttributes({ target: val });
					}}
				/>
				{'id' === target && (
					<TextControl
						label={__('Specify the post ID directly', 'arkhe-blocks')}
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
						'「抜粋」が入力されているページは、その内容が表示されます。',
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
					<ButtonGroup className='ark-btns--minWidth'>
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
			<PanelBody title={__('Sorting order setting', 'arkhe-blocks')} initialOpen={true}>
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
	);
}
