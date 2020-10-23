const exampleItem = {
	name: 'loos/faq-item',
	attributes: {
		contentQ: 'Question ?',
		// isPreview: true,
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
	attributes: {
		qIconStyle: 'fill-custom',
		aIconStyle: 'fill-custom',
	},
	innerBlocks: [exampleItem, exampleItem],
};
