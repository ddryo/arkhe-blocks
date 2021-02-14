const LoremP = {
	name: 'core/paragraph',
	attributes: {
		content:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
	},
};

export default {
	attributes: {
		isExample: true,
		tabWidthPC: 'fix',
	},
	innerBlocks: [
		{
			name: 'arkhe-blocks/tab-body',
			attributes: {
				id: 0,
			},
			innerBlocks: [LoremP],
		},
		{
			name: 'arkhe-blocks/tab-body',
			attributes: {
				id: 1,
			},
			innerBlocks: [LoremP],
		},
	],
};
