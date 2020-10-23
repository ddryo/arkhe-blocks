/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

import { useDispatch, useSelect } from '@wordpress/data';

export default function (props) {
	const { clientId, attributes, setAttributes } = props;
	const { stepLabel, startNum } = attributes;

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	// ステップブロック（親）のデータを取得
	const stepBlocksData = useSelect(
		(select) => select('core/block-editor').getBlocksByClientId(clientId)[0],
		[clientId]
	);

	return <InspectorControls></InspectorControls>;
}
