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
import { PanelBody, BaseControl, ButtonGroup, Button, ToggleControl } from '@wordpress/components';

/**
 * @Internal dependencies
 */
import metadata from './block.json';
import deprecated from './deprecated';
import blockIcon from './_icon';
import { iconColor } from '@blocks/config';
import { ArkheSVG } from '@components/ArkheSVG';

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
const blockName = 'ark-block-accordion';
registerBlockType(metadata.name, {
	title: __('Accordion item', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	attributes: metadata.attributes,
	// usesContext: ['arkhe-block/accordion/iconOpened', 'arkhe-block/accordion/iconClosed'],
	edit: ({ attributes, setAttributes }) => {
		// const iconOpened = context['arkhe-block/accordion/iconOpened'];
		// const iconClosed = context['arkhe-block/accordion/iconClosed'];
		const { iconOpened, iconClosed, isDefultOpen } = attributes;

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
						<ToggleControl
							label={__('Make it open by default', 'arkhe-blocks')}
							checked={isDefultOpen}
							onChange={(value) => {
								setAttributes({ isDefultOpen: value });
							}}
						/>
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
		const { title, iconOpened, iconClosed, isDefultOpen } = attributes;

		const blockProps = useBlockProps.save({
			className: `${blockName}__item`,
			'aria-expanded': isDefultOpen ? 'true' : 'false',
		});

		return (
			<div {...blockProps}>
				<div className={`${blockName}__title`} data-ark-acc>
					<span className={`${blockName}__label`}>
						<RichText.Content value={title} />
					</span>
					<span
						className={`${blockName}__icon`}
						aria-hidden='true'
						data-opened={isDefultOpen ? 'true' : 'false'}
					>
						<span className='__closed'>
							<ArkheSVG icon={iconClosed} size='24' />
						</span>
						<span className='__opened'>
							<ArkheSVG icon={iconOpened} size='24' />
						</span>
					</span>
				</div>

				<div
					className={`${blockName}__body ark-keep-mt--s`}
					aria-hidden={isDefultOpen ? 'false' : 'true'}
				>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
	deprecated,
});
