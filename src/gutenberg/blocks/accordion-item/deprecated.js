/**
 * @WordPress dependencies
 */
import { RichText, InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { ArkheSVG } from '@components/ArkheSVG';

/**
 * export deprecated
 */
const blockName = 'ark-block-accordion';
export default [
	{
		supports: {
			anchor: true,
			className: false,
			reusable: false,
		},
		attributes: {
			title: {
				type: 'string',
				source: 'html',
				selector: '.ark-block-accordion__label',
				default: '',
			},
			iconOpened: {
				type: 'string',
				default: 'arkb-svg-minus',
			},
			iconClosed: {
				type: 'string',
				default: 'arkb-svg-plus',
			},
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
						<span
							className={`${blockName}__icon`}
							aria-hidden='true'
							data-opened='false'
						>
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
	},
];
