const exampleItem = {
	name: 'arkhe-blocks/timeline-item',
	attributes: {
		title: 'Step Title.',
		timelineLabel: 'STEP',
		className: 'is-style-default',
	},
	innerBlocks: [
		{
			name: 'core/paragraph',
			attributes: {
				content:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
			},
		},
	],
};
export default {
	innerBlocks: [exampleItem, exampleItem, exampleItem],
};
