export default {
	attributes: {
		bgColor: '#f7f7f7',
		contentSize: 'article',
		pcPadding: '40',
	},
	innerBlocks: [
		{
			name: 'core/heading',
			attributes: {
				className: 'is-style-section_ttl',
				level: 2,
				content: 'Full Wide Block.',
			},
		},
		{
			name: 'core/paragraph',
			attributes: {
				className: 'has-text-align-center',
				content:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			},
		},
	],
};
