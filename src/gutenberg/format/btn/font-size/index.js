/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo, useCallback } from '@wordpress/element';
import { registerFormatType, applyFormat, removeFormat } from '@wordpress/rich-text';
import { URLPopover, RichTextToolbarButton } from '@wordpress/block-editor';
import { Button, ButtonGroup } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import fzIcon from './_icon';
import getPopoverAnchorRect from '@format/helper/getPopoverAnchorRect';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * 設定項目
 */
const fontSizes = [
	{
		label: 'XS',
		val: 'xs',
	},
	{
		label: 'S',
		val: 's',
	},
	{
		label: 'L',
		val: 'l',
	},
	{
		label: 'XL',
		val: 'xl',
	},
	{
		label: 'XXL',
		val: 'xxl',
	},
];

/**
 * Popoverコンポーネント
 */
const FormatPopover = (props) => {
	const { value, onClose, addFormat, deleteFormat, activeSizeClass } = props;

	const anchorRect = useMemo(() => getPopoverAnchorRect(true), []);
	if (!anchorRect) {
		return null;
	}
	// 新しい手法？ : https://github.com/WordPress/gutenberg/blob/707540c6cf/packages/format-library/src/text-color/inline.js#L95
	// const anchorRef = useAnchorRef({ ref: contentRef, value });

	return (
		<URLPopover
			value={value} // いる？
			anchorRect={anchorRect}
			onClose={onClose}
			className='components-inline-color-popover arkb-popover--fz'
		>
			<div className='arkb-format-controls--fz'>
				<ButtonGroup>
					{fontSizes.map((size) => {
						const isSelected = `arkb-fz-${size.val}` === activeSizeClass;
						return (
							<Button
								className={`-${size.val}`}
								isSecondary={!isSelected}
								isPrimary={isSelected}
								onClick={() => {
									if ('' === size.val || isSelected) {
										deleteFormat();
									} else {
										addFormat(size);
									}
								}}
								key={`arkb-fz-${size.val}`}
							>
								{size.label}
							</Button>
						);
					})}
				</ButtonGroup>
				<div className='arkb-format-clear'>
					<Button
						isSmall
						isSecondary
						onClick={() => {
							deleteFormat();
						}}
					>
						{__('Clear')}
					</Button>
				</div>
			</div>
		</URLPopover>
	);
};

/**
 * フォーマット登録
 */
const formatName = 'arkhe-blocks/font-size';
const formatTitle = __('Font size', 'arkhe-blocks');

registerFormatType(formatName, {
	title: formatTitle,
	tagName: 'span',
	className: 'arkb-fz',
	attributes: {
		class: 'class', // getActiveFormat() の結果は 適用時と保存更新後で変わるので同じ文字列にしておく
	},
	edit: ({ value, onChange, isActive, activeAttributes }) => {
		const [isAddingFormat, setIsAddingFormat] = useState(false);

		// 現在適用中のクラスを取得
		const activeSizeClass = useMemo(() => {
			return activeAttributes.class || '';
		}, [value]);

		// ボタンのクラス
		const formatButtonClass = classnames('format-library-text-color-button', {
			'is-pressed': isActive,
		});

		// フォーマット適用
		const addFormat = useCallback(
			(size) => {
				onChange(
					applyFormat(value, {
						type: formatName,
						attributes: {
							class: 'arkb-fz-' + size.val,
						},
					})
				);
			},
			[value, onChange]
		);

		// フォーマット削除
		const deleteFormat = useCallback(() => {
			onChange(removeFormat(value, formatName));
			setIsAddingFormat(false);
		}, [value, onChange]);

		// onClose
		const onClose = useCallback(() => {
			setIsAddingFormat(false);
		}, [setIsAddingFormat]);

		return (
			<>
				<RichTextToolbarButton
					key={isActive ? 'arkb-fz' : 'arkb-fz-not-active'}
					name={isActive ? 'arkb-fz' : 'arkb-controls'}
					title={formatTitle}
					className={formatButtonClass}
					icon={fzIcon}
					onClick={() => {
						setIsAddingFormat(true);
					}}
				/>
				{isAddingFormat && (
					<FormatPopover
						{...{
							value,
							onClose,
							addFormat,
							deleteFormat,
							activeSizeClass,
						}}
					/>
				)}
			</>
		);
	},
});
