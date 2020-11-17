const exampleItem = {
	name: 'arkhe-blocks/step-item',
	attributes: {
		title: 'Step Title.',
		stepLabel: 'STEP',
		className: 'is-style-default',
	},
	innerBlocks: [
		{
			name: 'core/paragraph',
			attributes: {
				content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
			},
		},
	],
};
export default {
	innerBlocks: [exampleItem, exampleItem, exampleItem],
};
