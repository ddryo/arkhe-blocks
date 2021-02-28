/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import formatIcon from './_icon';

const formatName = 'arkhe-blocks/mini-note';
const formatTitle = __('Annotation size', 'arkhe-blocks');

registerFormatType(formatName, {
	title: formatTitle,
	tagName: 'small',
	className: 'arkb-small',
	edit: ({ isActive, value, onChange }) => {
		return (
			<RichTextToolbarButton
				name='arkb-controls'
				title={formatTitle}
				icon={formatIcon}
				isActive={isActive}
				onClick={() => {
					return onChange(toggleFormat(value, { type: formatName }));
				}}
			/>
		);
	},
});
