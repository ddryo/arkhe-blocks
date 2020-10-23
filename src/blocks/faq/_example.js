const exampleItem = {
	name: 'arkhe-blocks/faq-item',
	attributes: {
		textQ: 'Question title',
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
