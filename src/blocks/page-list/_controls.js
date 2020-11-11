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
		showThumb,
		hTag,

		// excerptLength,
	} = attributes;

	// トグルコントロール
	const toggleData = [
		{
			name: 'showSite',
			label: __('Show page name of site', 'arkhe-blocks'),
			value: showSite,
		},
		{
			name: 'showDate',
			label: __('Show release date', 'arkhe-blocks'),
			description: '',
			value: showDate,
		},
		{
			name: 'showAuthor',
			label: __('Show author', 'arkhe-blocks'),
			value: showAuthor,
		},
	];

	if ('simple' !== listType) {
		toggleData.push({
			name: 'showThumb',
			label: __('Show thumbnail', 'arkhe-blocks'),
			value: showThumb,
		});
	}

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
			<PanelBody title={__('RSS settings', 'arkhe-blocks')} initialOpen={true}>
				<TextControl
					label={__('RSS feed URL', 'arkhe-blocks')}
					value={rssUrl}
					onChange={(val) => {
						setAttributes({ rssUrl: val });
					}}
				/>
				<TextControl
					label={__('RSS feed page name', 'arkhe-blocks')}
					value={pageName}
					onChange={(val) => {
						setAttributes({ pageName: val });
					}}
				/>
				<ToggleControl
					label={__('Use the cache', 'arkhe-blocks')}
					help={__(
						'If you want to clear the cache, turn it off only once.',
						'arkhe-blocks'
					)}
					checked={useCache}
					onChange={(val) => {
						setAttributes({ useCache: val });
					}}
				/>
			</PanelBody>

			<PanelBody title={__('Display settings', 'arkhe-blocks')} initialOpen={true}>
				<RangeControl
					label={__('Number of posts to display', 'arkhe-blocks') + '(PC)'}
					value={listCountPC}
					onChange={(val) => {
						setAttributes({ listCountPC: val });
					}}
					min={1}
					max={10}
				/>
				<RangeControl
					label={__('Number of posts to display', 'arkhe-blocks') + '(SP)'}
					value={listCountSP}
					onChange={(val) => {
						setAttributes({ listCountSP: val });
					}}
					min={1}
					max={10}
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
		</InspectorControls>
	);
}
