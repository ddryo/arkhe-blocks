/**
 * see: https://github.com/WordPress/gutenberg/blob/004a32ec09/packages/block-editor/src/components/rich-text/format-toolbar-container.js
 * see: https://github.com/WordPress/gutenberg/blob/004a32ec09/packages/block-editor/src/components/rich-text/format-toolbar/index.js
 */

/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
// import { useSelect } from '@wordpress/data';
import { registerFormatType } from '@wordpress/rich-text';
import { BlockFormatControls } from '@wordpress/block-editor';
import { Slot, ToolbarGroup } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { ArkbDropdownMenu } from '@format/components/ArkbDropdownMenu';
import { formatIcon } from '@format/icon';

import '@format/btn/clear'; // 書式クリア
import '@format/btn/mini-note'; // 注釈ボタン
import '@format/btn/font-size'; // フォントサイズ
import '@format/btn/letter-spacing'; // カーニング
// import '@format/btn/bg-color'; // 背景色
// import '@format/btn/marker'; // マーカー

import '@format/btn/custom'; // カスタムボタン
// import '@format/doropdown/shortcode'; // ショートコード用ドロップダウンメニューの登録

const fillNames = [
	'arkb-fz',
	'arkb-ls',
	//'bg-color',
	//'arkb-marker',
];

/**
 * ドロップダウンメニューたち
 */
registerFormatType('arkhe-blocks/formats', {
	title: 'Arkhe Formats',
	tagName: 'arkb-dropdown', //なんか指定しないとでてこない
	className: null,
	edit: () => {
		// const showShortcodeToolbtn = 1;

		return (
			<BlockFormatControls>
				<div className='block-editor-format-toolbar arkb-format-toolbar'>
					<ToolbarGroup>
						<ArkbDropdownMenu
							fillName='arkb-controls'
							icon={formatIcon.arkheLogo}
							label={__('Arkhe Format', 'arkhe-blocks')}
						/>
						{/* {showShortcodeToolbtn && (
							<ArkbDropdownMenu
								fillName='arkbShortcode'
								icon={formatIcon.shortcode}
								label={__('Shortcodes', 'arkhe-blocks')}
							/>
						)} */}

						{fillNames.map((format) => (
							<Slot name={`RichText.ToolbarControls.${format}`} key={format} />
						))}
					</ToolbarGroup>
				</div>
			</BlockFormatControls>
		);
	},
});
