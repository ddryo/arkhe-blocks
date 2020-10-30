/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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

/**
 * 投稿リストコントロール
 */
export default function (props) {
	const { attributes, setAttributes } = props;

	const {
		listType,
		listCount,
		showDate,
		showModified,
		showAuthor,
		showCat,
		order,
		orderby,
		hTag,
		moreText,
		moreUrl,
		excerptLength,
	} = attributes;

	// トグルコントロール
	const toggleData = [
		{
			name: 'showDate',
			label: '公開日を表示する',
			description: '',
			value: showDate,
		},
		{
			name: 'showModified',
			label: '更新日を表示する',
			description: '',
			value: showModified,
		},
		{
			name: 'showCat',
			label: 'カテゴリーを表示する',
			value: showCat,
		},
		{
			name: 'showAuthor',
			label: '著者を表示する',
			value: showAuthor,
		},
	];

	// リストタイプ
	const listTypeOptions = [
		{
			label: 'カード型',
			value: 'card',
		},
		{
			label: 'リスト型',
			value: 'list',
		},
		{
			label: 'テキスト型',
			value: 'simple',
		},
	];

	// 何を基準に並べるか
	const orderbyOptions = [
		{
			label: '新着順',
			value: 'date',
		},
		{
			label: '更新日',
			value: 'modified',
		},
		{
			label: 'ランダム',
			value: 'rand',
		},
	];

	const orderOptions = [
		{
			label: '降順',
			value: 'DESC',
		},
		{
			label: '昇順',
			value: 'ASC',
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
			<PanelBody title='表示設定' initialOpen={true}>
				<RangeControl
					label='表示する投稿数'
					value={listCount}
					onChange={(val) => {
						setAttributes({ listCount: val });
					}}
					min={1}
					max={12}
				/>
				<RadioControl
					label='レイアウトを選択'
					selected={listType}
					options={listTypeOptions}
					onChange={(val) => {
						setAttributes({ listType: val });
					}}
				/>

				<BaseControl className='toggle_group'>
					<BaseControl.VisualLabel>
						{__('各種表示設定', 'arkhe-blocks')}
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
								// help={(<small>{toggle.description}</small>)}
								checked={toggle.value}
								onChange={(val) => {
									setAttributes({ [toggle.name]: val });
								}}
								key={`toggle_${toggle.name}`}
							/>
						);
					})}
				</BaseControl>

				{/* <BaseControl> */}
				<RangeControl
					label={__('抜粋文の文字数', 'arkhe-blocks')}
					value={excerptLength}
					onChange={(val) => {
						setAttributes({ excerptLength: val });
					}}
					min={0}
					max={320}
				/>
				{/* </BaseControl> */}

				{'simple' !== listType && (
					<BaseControl>
						<BaseControl.VisualLabel>
							{__('タイトルのHTMLタグ', 'arkhe-blocks')}
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
				)}
			</PanelBody>
			<PanelBody title={__('並び順の設定', 'arkhe-blocks')} initialOpen={true}>
				<RadioControl
					label='投稿の表示順序'
					selected={orderby}
					options={orderbyOptions}
					onChange={(val) => {
						setAttributes({ orderby: val });
					}}
				/>
				<RadioControl
					label='降順か昇順か'
					selected={order}
					options={orderOptions}
					onChange={(val) => {
						setAttributes({ order: val });
					}}
				/>
			</PanelBody>
			<PanelBody title={__('リスト下のリンク', 'arkhe-blocks')} initialOpen={true}>
				<TextControl
					label={__('表示テキスト', 'arkhe-blocks')}
					value={moreText}
					placeholder={__('See more', 'arkhe-blocks')}
					onChange={(val) => setAttributes({ moreText: val })}
				/>

				<TextControl
					label={__('リンクのURL', 'arkhe-blocks')}
					value={moreUrl}
					onChange={(val) => setAttributes({ moreUrl: val })}
				/>
			</PanelBody>
		</>
	);
}
