/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';

/**
 * @SWELL dependencies
 */
import setBlankRel from '@swell-guten/utils/setBlankRel';

/**
 * 関連記事ブロック
 */
export default function (props) {
	const { attributes, setAttributes } = props;
	// const nowClass = attributes.className || '';

	const { cardCaption, isNewTab, externalUrl, rel } = attributes;

	let relVal = rel;
	if (externalUrl && !rel) relVal = 'noopener noreferrer';
	if (isNewTab && !rel) relVal = 'noopener noreferrer';

	// パネル生成
	return (
		<>
			<PanelBody title='関連記事設定' initialOpen={true}>
				<TextControl
					label='キャプション'
					value={cardCaption}
					onChange={(val) => {
						setAttributes({ cardCaption: val });
					}}
				/>
			</PanelBody>
			<PanelBody title='リンク設定' initialOpen={true}>
				<>
					<ToggleControl
						id='loosbtn_is_new_open'
						label={__('Open in new tab')}
						help='※ 外部サイトへのリンクでは、「新しいタブで開く」の設定は無視され、強制的にオンになります。'
						checked={externalUrl ? true : isNewTab}
						className={externalUrl ? '-is-external' : null}
						onChange={(value) => {
							const newRel = setBlankRel(value, rel);
							setAttributes({
								isNewTab: value,
								rel: newRel,
							});
						}}
					/>
					<TextControl
						label={__('Link rel')}
						value={relVal || ''}
						onChange={(value) => {
							setAttributes({ rel: value });
						}}
					/>
				</>
			</PanelBody>
		</>
	);
}
