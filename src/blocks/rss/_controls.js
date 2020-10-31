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

	const {
		rssUrl,
		pageName,
		useCache,
		listType,
		listCountPC,
		listCountSP,
		showDate,
		showAuthor,
		showSite,
		hTag,

		// excerptLength,
	} = attributes;

	// トグルコントロール
	const toggleData = [
		{
			name: 'showSite',
			label: 'サイト名を表示する',
			value: showSite,
		},
		{
			name: 'showDate',
			label: '公開日を表示する',
			description: '',
			value: showDate,
		},
		// {
		// 	name: 'showModified',
		// 	label: '更新日を表示する',
		// 	description: '',
		// 	value: showModified,
		// },
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

	return (
		<InspectorControls>
			<PanelBody title='RSS設定' initialOpen={true}>
				<TextControl
					label={__('RSSフィードのURL', 'arkhe-blocks')}
					value={rssUrl}
					onChange={(val) => {
						setAttributes({ rssUrl: val });
					}}
				/>
				<TextControl
					label={__('RSSフィードのページ名', 'arkhe-blocks')}
					value={pageName}
					onChange={(val) => {
						setAttributes({ pageName: val });
					}}
				/>
				<ToggleControl
					label={__('キャッシュを利用する', 'arkhe-blocks')}
					help={__(
						'キャッシュを削除したい時、一度だけオフにしてください。',
						'arkhe-blocks'
					)}
					checked={useCache}
					onChange={(val) => {
						setAttributes({ useCache: val });
					}}
				/>
			</PanelBody>

			<PanelBody title='表示設定' initialOpen={true}>
				<RangeControl
					label={'表示する投稿数' + '(PC)'}
					value={listCountPC}
					onChange={(val) => {
						setAttributes({ listCountPC: val });
					}}
					min={1}
					max={10}
				/>
				<RangeControl
					label={'表示する投稿数' + '(SP)'}
					value={listCountSP}
					onChange={(val) => {
						setAttributes({ listCountSP: val });
					}}
					min={1}
					max={10}
				/>
				<RadioControl
					label='リストのレイアウト'
					selected={listType}
					options={listTypeOptions}
					onChange={(val) => {
						setAttributes({ listType: val });
					}}
				/>

				<BaseControl className='ark-ctrl-toggles'>
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
								checked={toggle.value}
								onChange={(val) => {
									setAttributes({ [toggle.name]: val });
								}}
								key={`toggle_${toggle.name}`}
							/>
						);
					})}
				</BaseControl>
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
			</PanelBody>
		</InspectorControls>
	);
}
