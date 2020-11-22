const exampleItem = {
	name: 'arkhe-blocks/box-link',
	attributes: {
		title: 'Box Link',
		imgUrl: 'https://s.w.org/images/core/5.3/MtBlanc1.jpg',
	},
	innerBlocks: [
		{
			name: 'core/paragraph',
			attributes: {
				content:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
			},
		},
	],
};
export default {
	attributes: {
		colPC: 2,
	},
	innerBlocks: [exampleItem, exampleItem],
};
