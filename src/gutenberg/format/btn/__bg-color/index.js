/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useMemo } from '@wordpress/element';
import { registerFormatType, removeFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import FormatPopover from './_popover';
import getActiveColor from '../../helper/getActiveColor';
// import { formatIcon } from '@format/icon';

const formatName = 'arkhe-blocks/bg-color';
const formatTitle = '背景色';

registerFormatType(formatName, {
	title: formatTitle,
	tagName: 'span',
	className: 'arkb-bg-color',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: ({ isActive, value, onChange }) => {
		if (useSelect === undefined) return null;
		const [isAddingColor, setIsAddingColor] = useState(false);

		// カラーパレットの設定を読み取っている？
		const { colors, disableCustomColors } = useSelect((select) => {
			const blockEditorSelect = select('core/block-editor');
			let settings;
			if (blockEditorSelect && blockEditorSelect.getSettings) {
				settings = blockEditorSelect.getSettings();
			} else {
				settings = {};
			}
			return {
				colors: settings.colors || [],
				disableCustomColors: settings.disableCustomColors,
			};
		});

		// アイコンの下線の色
		const colorIndicatorStyle = useMemo(() => {
			const activeColor = getActiveColor(formatName, value, colors);
			if (!activeColor) {
				return undefined;
			}
			return {
				backgroundColor: activeColor,
			};
		}, [value, colors]);

		// hasColorsToChoose : カラーパレットが有効化どうか。
		const hasColorsToChoose = !colors || true !== disableCustomColors;
		if (!hasColorsToChoose && !isActive) {
			// カラーパレットが無効、かつ設定もない時は null
			return null;
		}

		return (
			<>
				<RichTextToolbarButton
					key={isActive ? 'bg-color' : 'bg-color-not-active'}
					name={isActive ? 'bg-color' : 'arkb-controls'}
					title={formatTitle}
					className='format-library-text-color-button'
					icon={
						<>
							<Icon icon='admin-appearance' />
							{isActive && (
								// アイコンの下線
								<span
									className='format-library-text-color-button__indicator'
									style={colorIndicatorStyle}
								/>
							)}
						</>
					}
					// カラーパレットが無効だけど過去の設定があれば、removeFormatさせる。
					onClick={() => {
						if (hasColorsToChoose) {
							setIsAddingColor(true);
						} else {
							onChange(removeFormat(value, formatName));
						}
					}}
				/>
				{isAddingColor && (
					<FormatPopover
						name={formatName}
						className='components-inline-color-popover'
						isAddingColor={isAddingColor}
						value={value}
						isActive={isActive}
						onChange={onChange}
						onClose={() => setIsAddingColor(false)}
						colors={colors}
					/>
				)}
			</>
		);
	},
});
