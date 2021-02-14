const exampleItem = {
	name: 'arkhe-blocks/accordion-item',
	attributes: {
		title: 'Accordion Title.',
	},
	innerBlocks: [
		{
			name: 'core/paragraph',
			attributes: {
				content:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			},
		},
	],
};
export default {
	innerBlocks: [exampleItem, exampleItem],
};
