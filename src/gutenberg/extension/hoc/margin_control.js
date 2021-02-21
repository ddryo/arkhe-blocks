/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
// import { useSelect } from '@wordpress/data';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	BlockControls,
	//InspectorControls
} from '@wordpress/block-editor';

/**
 * @Self dependencies
 */
import { ArkheMarginControl } from '@components/ArkheMarginControl';
// import MarginPanel from './components/MarginPanel';

/**
 * マージンコントロール
 */
const addMarginControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes, isSelected } = props;

		// コアブロックかどうか
		const isCore = -1 !== name.indexOf('core/');

		// 除去するブロック
		const removalBlocks = ['core/shortcode', 'core/html', 'core/block'];
		const isRemovalBlocks = -1 !== removalBlocks.indexOf(name);

		// 条件似合わない場合は返す
		if (!isSelected || !isCore || isRemovalBlocks) {
			return <BlockEdit {...props} />;
		}

		// マージンコントロールを表示するかどうか
		// const arkheBlockSettings = useSelect((select) => {
		// 	return select(swellStore).getSettings();
		// }, []);
		// const showMarginToolBtn = arkheBlockSettings.show_margin_toolbtn;
		const showMarginToolBtn = 1;

		return (
			<>
				<BlockEdit {...props} />
				{showMarginToolBtn && (
					<BlockControls>
						<ArkheMarginControl
							className={attributes.className}
							setAttributes={setAttributes}
						/>
					</BlockControls>
				)}

				{/* <InspectorControls>
					<MarginPanel className={attributes.className} setAttributes={setAttributes} />
				</InspectorControls> */}
			</>
		);
	};
}, 'addMarginControls');
addFilter('editor.BlockEdit', 'swell-hook/add-margin-control', addMarginControls, 99);
