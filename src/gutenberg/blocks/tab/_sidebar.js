/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, TextControl, RadioControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

/**
 * sidebar
 */
export default ({ attributes, setAttributes, clientId }) => {
	const { activeTab, tabHeaders, tabWidth, isScrollPC, isScrollSP } = attributes;

	const { getBlockOrder } = wp.data.select('core/block-editor');
	const { updateBlockAttributes } = useDispatch('core/block-editor');

	return (
		<>
			<PanelBody title={__('Tab settings', 'arkhe-blocks')} initialOpen={true}>
				{/* <TextControl
					label={__('Tab block ID', 'arkhe-blocks')}
					help={__(
						'Do not duplicate it with other tab blocks on the same page.',
						'arkhe-blocks'
					)}
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
				/> */}
				<TextControl
					label={__('Number of tabs to open first', 'arkhe-blocks')}
					type='number'
					min='1'
					max={tabHeaders.length}
					style={{ maxWidth: '6em' }}
					value={activeTab + 1}
					onChange={(val) => {
						const newActiveNum = parseInt(val) - 1;
						setAttributes({ activeTab: newActiveNum });

						const tabBodyIDs = getBlockOrder(clientId);
						tabBodyIDs.forEach((_tabBodyID) => {
							updateBlockAttributes(_tabBodyID, {
								activeTab: newActiveNum,
							});
						});
					}}
				/>
			</PanelBody>
			<PanelBody title={__('Tab size setting', 'arkhe-blocks')} initialOpen={true}>
				<RadioControl
					selected={tabWidth}
					options={[
						{
							label: __('Fit to text', 'arkhe-blocks'),
							value: 'auto',
						},
						{
							label: __('Fixed width', 'arkhe-blocks') + '(PC:25%, SP:50%)',
							value: 'fix',
						},
						{
							label: __('Equal width', 'arkhe-blocks'),
							value: 'equal',
						},
					]}
					onChange={(val) => {
						setAttributes({ tabWidth: val });
					}}
				/>
				<ToggleControl
					label={__('Make it scrollable', 'arkhe-blocks') + '(PC)'}
					checked={isScrollPC}
					onChange={(value) => {
						setAttributes({ isScrollPC: value });
					}}
				/>
				<ToggleControl
					label={__('Make it scrollable', 'arkhe-blocks') + '(SP)'}
					checked={isScrollSP}
					onChange={(value) => {
						setAttributes({ isScrollSP: value });
					}}
				/>
			</PanelBody>
		</>
	);
};
