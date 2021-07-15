/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

/**
 * @Internal dependencies
 */
import metadata from './block.json';

/**
 * @Others dependencies
 */
import classnames from 'classnames';
// const oldAttrs = {
// 	isExample: {
// 		type: 'boolean',
// 		default: false,
// 	},
// 	tabId: {
// 		type: 'string',
// 		default: '',
// 	},
// 	activeTab: {
// 		type: 'number',
// 		default: 0,
// 	},
// 	tabWidth: {
// 		type: 'string',
// 		default: 'auto',
// 	},
// 	isScrollPC: {
// 		type: 'boolean',
// 		default: false,
// 	},
// 	isScrollSP: {
// 		type: 'boolean',
// 		default: false,
// 	},
// 	tabColor: {
// 		type: 'string',
// 		default: '',
// 	},
// };

/**
 * export deprecated
 */
const blockName = 'ark-block-tab';
export default [
	{
		supports: metadata.supports,
		attributes: {
			...metadata.attributes,
			...{
				tabHeaders: {
					type: 'array',
					default: [__('Tab', 'arkhe-blocks') + ' 1', __('Tab', 'arkhe-blocks') + ' 2'],
				},
			},
		},
		save: ({ attributes }) => {
			const { tabId, tabHeaders, activeTab, tabWidth, isScrollPC, isScrollSP } = attributes;

			const blockProps = useBlockProps.save({
				className: classnames(blockName, {
					'-scrollable-pc': isScrollPC,
					'-scrollable-sp': isScrollSP,
				}),
			});

			return (
				<div {...blockProps}>
					<ul role='tablist' className='arkb-tabList' data-tab-width={tabWidth}>
						{tabHeaders.map((header, index) => (
							<li key={index} className='arkb-tabList__item' role='presentation'>
								<button
									className={`arkb-tabList__button`}
									role='tab'
									aria-selected={activeTab === index ? 'true' : 'false'}
									aria-controls={`tab-${tabId}-${index}`}
									data-onclick='tabControl'
								>
									<RawHTML>{header}</RawHTML>
								</button>
							</li>
						))}
					</ul>
					<div className='arkb-tabBody'>
						<InnerBlocks.Content />
					</div>
				</div>
			);
		},
	},
];
