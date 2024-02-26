export const attributes = {
	publisherBorder: {
		type: 'object',
		default: {
			type: 'all',
			all: {
				width: '',
				style: 'solid',
				color: '',
			},
		},
	},
	publisherBorderRadius: {
		type: 'object',
		default: {
			type: 'all',
			all: '',
		},
	},
	publisherBoxShadow: {
		type: 'object',
		default: {},
	},
	publisherOutline: {
		type: 'object',
		default: {},
	},
};
