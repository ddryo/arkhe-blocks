/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { InnerBlocks, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useEffect, useContext } from '@wordpress/element';
import { closeSmall } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './_icon';
import metadata from './block.json';
import SlideSidebar from './_sidebar';
import { MediaEdit, RichEdit } from './edit';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * フォーカスしたスライドへスクロール
 */
const scrollToSelectedSlide = (clientId, direction) => {
	const me = document.querySelector(`#block-${clientId}`);
	if (null === me) return;

	const parentNode = me.parentNode;
	if (null === parentNode) return;

	const firstNode = parentNode.childNodes[0];

	if ('vertical' === direction) {
		const offset = firstNode ? firstNode.offsetTop : 0;
		parentNode.scrollTop = me.offsetTop - offset;
	} else {
		const offset = firstNode ? firstNode.offsetLeft : 0;
		parentNode.scrollLeft = me.offsetLeft - offset;
	}
};

/**
 * registerBlockType
 */
registerBlockType(metadata.name, {
	title: __('Slider content', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	attributes: metadata.attributes,

	edit: (props) => {
		const { attributes, setAttributes, clientId, isSelected } = props;

		// Contextの取得
		const { SliderContext } = window.arkbContext;
		const context = useContext(SliderContext);

		const { parentID, childIDs, setActSlide, removeSlide, direction } = context;

		const { myIndex, isLast } = useSelect(
			(select) => {
				const _index = select('core/block-editor').getBlockIndex(clientId, parentID);
				return {
					myIndex: _index,
					isFirst: _index === 0,
					isLast: _index === childIDs.length - 1,
				};
			},
			[clientId, parentID, childIDs]
		);

		useEffect(() => {
			if (isSelected) {
				scrollToSelectedSlide(clientId, direction);
				setActSlide(myIndex);
			}
		}, [clientId, isSelected, childIDs, direction]);

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							className='components-toolbar__control arkb-toolBtn--deleteSlide'
							label={__('Delete this slide', 'arkhe-blocks')}
							icon={closeSmall}
							onClick={() => {
								removeSlide(myIndex, isLast);
							}}
						>
							{__('Delete this slide', 'arkhe-blocks')}
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>
				<InspectorControls>
					<SlideSidebar {...{ attributes, setAttributes, clientId }} />
				</InspectorControls>
				{'media' === attributes.variation ? (
					<MediaEdit {...{ attributes, setAttributes, clientId }} />
				) : (
					<RichEdit {...{ attributes, setAttributes, clientId }} />
				)}
			</>
		);
	},

	save: () => {
		return <InnerBlocks.Content />;
	},
});
