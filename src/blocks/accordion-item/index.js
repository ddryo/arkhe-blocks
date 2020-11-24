/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	RichText,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, BaseControl, ButtonGroup, Button } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import { ArkheSVG } from '@components/ArkheSVG';
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-accordion';
const { apiVersion, name, category, supports, parent, usesContext } = metadata;

/**
 * 設定
 */
const iconSets = [
	{
		closed: 'arkb-svg-plus',
		opened: 'arkb-svg-minus',
	},
	{
		closed: 'arkb-svg-drop_down',
		opened: 'arkb-svg-drop_up',
	},
];

/**
 * アコーディオン項目ブロック
 */
registerBlockType(name, {
	apiVersion,
	title: __('Accordion item', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	usesContext,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes } = props;
		// const iconOpened = context['arkhe-block/accordion/iconOpened'];
		// const iconClosed = context['arkhe-block/accordion/iconClosed'];

		const { iconOpened, iconClosed } = attributes;

		const blockProps = useBlockProps({
			className: `${blockName}__item`,
			'aria-expanded': 'true',
		});
		const innerBlocksProps = useInnerBlocksProps(
			{
				className: `${blockName}__body ark-keep-mt--s`,
			},
			{
				template: [['core/paragraph']],
				templateLock: false,
			}
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
						<BaseControl>
							<BaseControl.VisualLabel>
								{__('Box layout', 'arkhe-blocks')}
							</BaseControl.VisualLabel>
							<ButtonGroup className='arkb-btns--acc'>
								{iconSets.map((iconSet) => {
									return (
										<Button
											isLarge
											isPrimary={iconSet.opened === iconOpened}
											onClick={() => {
												setAttributes({
													iconOpened: iconSet.opened,
													iconClosed: iconSet.closed,
												});
											}}
											key={`iconkey_${iconSet.set}`}
										>
											<ArkheSVG icon={iconSet.opened} />
											<span>/</span>
											<ArkheSVG icon={iconSet.closed} />
										</Button>
									);
								})}
							</ButtonGroup>
						</BaseControl>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<div className={`${blockName}__title`}>
						<RichText
							tagName='div'
							className={`${blockName}__label`}
							placeholder={__('Enter text', 'arkhe-blocks') + '...'}
							value={attributes.title}
							onChange={(title) => setAttributes({ title })}
						/>
						<span
							className={`${blockName}__icon`}
							aria-hidden='false'
							data-opened='true'
						>
							<span className='__closed'>
								<ArkheSVG icon={iconClosed} />
							</span>
							<span className='__slash'>/</span>
							<span className='__opened'>
								<ArkheSVG icon={iconOpened} />
							</span>
						</span>
					</div>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { title, iconOpened, iconClosed } = attributes;

		const blockProps = useBlockProps.save({
			className: `${blockName}__item`,
			'aria-expanded': 'false',
		});

		return (
			<div {...blockProps}>
				<div className={`${blockName}__title`} data-ark-acc>
					<span className={`${blockName}__label`}>
						<RichText.Content value={title} />
					</span>
					<span className={`${blockName}__icon`} aria-hidden='true' data-opened='false'>
						<span className='__closed'>
							<ArkheSVG icon={iconClosed} />
						</span>
						<span className='__opened'>
							<ArkheSVG icon={iconOpened} />
						</span>
					</span>
				</div>

				<div className={`${blockName}__body ark-keep-mt--s`} aria-hidden='true'>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
