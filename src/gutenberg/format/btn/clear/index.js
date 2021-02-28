/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { registerFormatType, removeFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

const formatName = 'arkhe-blocks/clear';
const formatTitle = __('Clear format', 'arkhe-blocks');

registerFormatType(formatName, {
	title: formatTitle,
	tagName: 'span',
	className: 'arkb-clear-fomat',
	edit: ({ isActive, value, onChange }) => {
		const formatTypes = useSelect((select) => select('core/rich-text').getFormatTypes());
		return (
			<RichTextToolbarButton
				name='arkb-controls'
				icon='editor-removeformatting'
				title={formatTitle}
				isActive={isActive}
				onClick={() => {
					if (0 < formatTypes.length) {
						let newValue = value;
						formatTypes.map((format) => {
							newValue = removeFormat(newValue, format.name);
						});
						onChange({ ...newValue }); // newValue: removeFormat し終わった value
					}
				}}
			/>
		);
	},
});
