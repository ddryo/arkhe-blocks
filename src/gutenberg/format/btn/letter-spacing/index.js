/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo, useCallback } from '@wordpress/element';
import {
	registerFormatType,
	// getActiveFormat,
	applyFormat,
	removeFormat,
	useAnchorRef,
} from '@wordpress/rich-text';
import { URLPopover, RichTextToolbarButton } from '@wordpress/block-editor';
import { Button, TextControl, SelectControl } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import lsIcons from './_icon';
import getPopoverAnchorRect from '@format/helper/getPopoverAnchorRect';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * Popoverコンポーネント
 */
const FormatPopover = (props) => {
	const { value, onClose, addFormat, deleteFormat, activeSpaceNum, activeSpaceUnit } = props;

	const anchorRect = useMemo(() => getPopoverAnchorRect(true), []);
	if (!anchorRect) {
		return null;
	}

	const isEm = 'em' === activeSpaceUnit;
	const stepNum = isEm ? 0.1 : 1;
	const minNum = isEm ? -1 : -10;

	return (
		<URLPopover
			value={value}
			anchorRect={anchorRect}
			onClose={onClose}
			className='components-inline-color-popover arkb-popover--ls'
		>
			<div className='arkb-format-controls--ls'>
				<TextControl
					autoComplete='off'
					value={activeSpaceNum}
					type='number'
					step={stepNum}
					min={minNum}
					onChange={(newNum) => {
						addFormat(newNum, activeSpaceUnit);
					}}
				/>
				<SelectControl
					value={activeSpaceUnit}
					options={['px', 'em'].map((unit) => {
						return { label: unit, value: unit };
					})}
					onChange={(newUnit) => {
						if ('px' === newUnit) {
							addFormat(activeSpaceNum * 10, newUnit);
						} else {
							addFormat((activeSpaceNum * 0.1).toFixed(1), newUnit);
						}
					}}
				/>
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
const formatName = 'arkhe-blocks/letter-spacing';
const formatTitle = __('Kerning', 'arkhe-blocks');

registerFormatType(formatName, {
	title: formatTitle,
	tagName: 'span',
	className: 'arkb-ls',
	attributes: {
		// getActiveFormat() の結果は 適用時と保存更新後で変わるので同じ文字列にしておく
		style: 'style',
	},
	edit: ({ value, onChange, isActive, activeAttributes }) => {
		const [isAddingFormat, setIsAddingFormat] = useState(false);

		// 現在適用中のフォーマットを取得
		const { activeSpaceNum, activeSpaceUnit } = useMemo(() => {
			const attrStyle = activeAttributes.style;
			if (!attrStyle) return '';

			// letter-spacingの値を抜き出す
			const space = attrStyle.replace(new RegExp(`^letter-spacing:\\s*`), '');
			const spaceUnit = -1 !== space.indexOf('em') ? 'em' : 'px';
			const spaceNum = parseFloat(space);

			// NaNをチェックして返す
			return {
				activeSpaceNum: isNaN(spaceNum) ? 0 : spaceNum,
				activeSpaceUnit: spaceUnit,
			};
		}, [value]);

		// ボタンのクラス
		const formatButtonClass = classnames('format-library-text-color-button', {
			'is-pressed': isActive,
		});

		// フォーマット適用
		const addFormat = useCallback(
			(space, unit) => {
				onChange(
					applyFormat(value, {
						type: formatName,
						attributes: {
							style: `letter-spacing:${space}${unit}`,
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

		// フォーマット削除
		const onClose = useCallback(() => {
			setIsAddingFormat(false);
		}, [setIsAddingFormat]);

		return (
			<>
				<RichTextToolbarButton
					key={isActive ? 'arkb-ls' : 'arkb-ls-not-active'}
					name={isActive ? 'arkb-ls' : 'arkb-controls'}
					title={formatTitle}
					className={formatButtonClass}
					icon={lsIcons}
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
							activeSpaceNum,
							activeSpaceUnit,
						}}
					/>
				)}
			</>
		);
	},
});
