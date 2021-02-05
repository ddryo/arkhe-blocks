/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
// import { memo } from '@wordpress/element';

import { PanelBody, ToggleControl, TextControl, RadioControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

/**
 * @Inner dependencies
 */

export default ({ attributes, setAttributes, clientId }) => {
	// useDispatch が使えなければ null
	if (useDispatch === undefined) return null;

	const { tabId, activeTab, tabHeaders, tabWidth, isScrollPC, isScrollSP } = attributes;

	const { getBlockOrder } = wp.data.select('core/block-editor');
	const { updateBlockAttributes } = useDispatch('core/block-editor');

	return (
		<>
			<PanelBody title='タブ設定' initialOpen={true}>
				<TextControl
					label='タブブロックのID'
					help='※ 同じページにある他のタブブロックと被らないIDにしてください'
					value={tabId}
					onChange={(val) => {
						setAttributes({ tabId: val });
						const tabBodyIDs = getBlockOrder(clientId);
						for (let i = 0; i < tabBodyIDs.length; i++) {
							updateBlockAttributes(tabBodyIDs[i], {
								tabId: val,
							});
						}
					}}
				/>
				<TextControl
					label='何番目のタブを最初に開いておくか'
					type='number'
					min='1'
					max={tabHeaders.length}
					style={{ maxWidth: '6em' }}
					// help='※ 1始まり'
					value={activeTab + 1}
					onChange={(val) => {
						const newActiveNum = parseInt(val) - 1;
						setAttributes({ activeTab: newActiveNum });

						const tabBodyIDs = getBlockOrder(clientId);
						for (let i = 0; i < tabBodyIDs.length; i++) {
							updateBlockAttributes(tabBodyIDs[i], {
								activeTab: newActiveNum,
							});
						}
					}}
				/>
			</PanelBody>
			<PanelBody title='タブサイズ設定' initialOpen={true}>
				<RadioControl
					// label='PCサイズ'
					selected={tabWidth}
					options={[
						{
							label: 'テキストに合わせる',
							value: 'auto',
						},
						{
							label: '固定幅(PC:25%, SP:50%)',
							value: 'fix',
						},
						{
							label: '均等幅',
							value: 'equal',
						},
					]}
					onChange={(val) => {
						setAttributes({ tabWidth: val });
					}}
				/>
				<ToggleControl
					label='ナビをスクロール可能にする(PC)'
					checked={isScrollPC}
					onChange={(value) => {
						setAttributes({
							isScrollPC: value,
						});
					}}
				/>
				<ToggleControl
					label='ナビをスクロール可能にする(SP)'
					checked={isScrollSP}
					onChange={(value) => {
						setAttributes({
							isScrollSP: value,
						});
					}}
				/>
			</PanelBody>
		</>
	);
};
