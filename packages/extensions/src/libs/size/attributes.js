export const attributes = {
	publisherWidth: {
		type: 'string',
	},
	publisherHeight: {
		type: 'string',
	},
	publisherMinWidth: {
		type: 'string',
		default: '',
	},
	publisherMinHeight: {
		type: 'string',
		default: '',
	},
	publisherMaxWidth: {
		type: 'string',
		default: '',
	},
	publisherMaxHeight: {
		type: 'string',
		default: '',
	},
	publisherOverflow: {
		type: 'string',
		default: '',
	},
	publisherRatio: {
		type: 'object',
		default: { value: '', width: '', height: '' },
	},
	publisherFit: {
		type: 'string',
		default: '',
	},
	publisherFitPosition: {
		type: 'object',
		default: { top: '', left: '' },
	},
};
