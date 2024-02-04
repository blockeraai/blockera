export const attributes = {
	publisherPosition: {
		type: 'object',
		default: {
			type: 'static',
			position: {
				top: '',
				right: '',
				bottom: '',
				left: '',
			},
		},
	},
	publisherZIndex: {
		type: 'string',
		default: '',
	},
};
