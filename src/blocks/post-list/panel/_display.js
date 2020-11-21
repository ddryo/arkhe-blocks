/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	// TextControl,
	BaseControl,
	// CheckboxControl,
	RadioControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';

/**
 * 投稿リストコントロール
 */
export default function (props) {
	const { attributes, setAttributes } = props;

	const {
		listType,
		listCountPC,
		listCountSP,
		showDate,
		showModified,
		showAuthor,
		showCat,
		showStickyPosts,
		order,
		orderby,
		hTag,
		excerptLength,
	} = attributes;

	// トグルコントロール
	const toggleData = [
		{
			name: 'showDate',
			label: __('Show release date', 'arkhe-blocks'),
			description: '',
			value: showDate,
		},
		{
			name: 'showModified',
			label: __('Show update date', 'arkhe-blocks'),
			description: '',
			value: showModified,
		},
		{
			name: 'showCat',
			label: __('Show category', 'arkhe-blocks'),
			value: showCat,
		},
		{
			name: 'showAuthor',
			label: __('Show author', 'arkhe-blocks'),
			value: showAuthor,
		},
		{
			name: 'showStickyPosts',
			label: __('Show sticky posts', 'arkhe-blocks'),
			value: showStickyPosts,
		},
	];

	// リストタイプ
	const listTypeOptions = [
		{
			label: __('Card type', 'arkhe-blocks'),
			value: 'card',
		},
		{
			label: __('List type', 'arkhe-blocks'),
			value: 'list',
		},
		{
			label: __('Text type', 'arkhe-blocks'),
			value: 'simple',
		},
	];

	// 何を基準に並べるか
	const orderbyOptions = [
		{
			label: __('Release date', 'arkhe-blocks'),
			value: 'date',
		},
		{
			label: __('Update date', 'arkhe-blocks'),
			value: 'modified',
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

	// パネル生成
	return (
		<>
			<PanelBody title={__('Display settings', 'arkhe-blocks')} initialOpen={true}>
				<RangeControl
					label={__('Number of posts to display', 'arkhe-blocks') + '(PC)'}
					value={listCountPC}
					onChange={(val) => {
						setAttributes({ listCountPC: val });
					}}
					min={1}
					max={24}
				/>
				<RangeControl
					label={__('Number of posts to display', 'arkhe-blocks') + '(SP)'}
					value={listCountSP}
					onChange={(val) => {
						setAttributes({ listCountSP: val });
					}}
					min={1}
					max={24}
				/>
				<RadioControl
					label={__('List layout', 'arkhe-blocks')}
					selected={listType}
					options={listTypeOptions}
					onChange={(val) => {
						setAttributes({ listType: val });
					}}
				/>

				<BaseControl className='arkb-toggles'>
					<BaseControl.VisualLabel>
						{__('What to display', 'arkhe-blocks')}
					</BaseControl.VisualLabel>
					{toggleData.map((toggle) => {
						const label =
							'' === toggle.description ? (
								toggle.label
							) : (
								<span>
									{toggle.label}
									<br />
									<small>{toggle.description}</small>
								</span>
							);
						return (
							<ToggleControl
								label={label}
								checked={toggle.value}
								onChange={(val) => {
									setAttributes({ [toggle.name]: val });
								}}
								key={`toggle_${toggle.name}`}
							/>
						);
					})}
				</BaseControl>
				{'simple' !== listType && (
					<RangeControl
						label={__('Number of characters in the excerpt', 'arkhe-blocks')}
						value={excerptLength}
						help={__(
							'If "Excerpt" is entered, its contents will be displayed.',
							'arkhe-blocks'
						)}
						onChange={(val) => {
							setAttributes({ excerptLength: val });
						}}
						min={0}
						max={320}
						allowReset={true}
						className='arkb-range--useReset'
					/>
				)}
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
		</>
	);
}
