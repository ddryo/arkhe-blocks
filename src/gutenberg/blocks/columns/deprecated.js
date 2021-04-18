/**
 * @WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * 変数
 */
const blockName = 'ark-block-columns';
const basisSet = {
	col1: 100,
	col2: 50,
	col3: 33.33,
	col4: 25,
	col5: 20,
	col6: 16.66,
};

/**
 *
 */
export default [
	{
		supports: {
			anchor: true,
			className: false,
			align: ['wide', 'full'],
		},
		attributes: {
			vAlign: {
				type: 'string',
				default: '',
			},
			colPC: {
				type: 'string',
				source: 'attribute',
				selector: '.arkb-columns',
				attribute: 'data-col-pc',
				default: '2',
			},
			colTab: {
				type: 'string',
				source: 'attribute',
				selector: '.arkb-columns',
				attribute: 'data-col-tab',
				default: '2',
			},
			colMobile: {
				type: 'string',
				source: 'attribute',
				selector: '.arkb-columns',
				attribute: 'data-col',
				default: '1',
			},
		},
		migrate: (attributes) => {
			return {
				...attributes,
				margin: { x: '0.75rem', bottom: '1.5rem' },
			};
		},
		save: ({ attributes }) => {
			const { vAlign, colPC, colTab, colMobile } = attributes;
			const columnStyle = {
				'--arkb-fb': basisSet[`col${colMobile}`] + '%',
				'--arkb-fb_tab': basisSet[`col${colTab}`] + '%',
				'--arkb-fb_pc': basisSet[`col${colPC}`] + '%',
			};

			const blockProps = useBlockProps.save({
				className: `${blockName} arkb-columns`,
				style: columnStyle,
				'data-valign': vAlign || null,
				'data-col': colMobile,
				'data-col-tab': colTab,
				'data-col-pc': colPC,
			});

			return (
				<div {...blockProps}>
					<InnerBlocks.Content />
				</div>
			);
		},
	},
];
