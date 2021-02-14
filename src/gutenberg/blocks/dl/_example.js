const dt = {
	name: 'arkhe-blocks/dl-dt',
	attributes: {
		content: 'Item title',
	},
};
const dd = {
	name: 'arkhe-blocks/dl-dd',
	attributes: {},
	innerBlocks: [
		{
			name: 'core/paragraph',
			attributes: {
				content:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do incididunt ut labore et dolore magna aliqua.',
			},
		},
	],
};
export default {
	innerBlocks: [dt, dd, dt, dd],
};
