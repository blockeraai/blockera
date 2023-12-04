export const attributes = {
	publisherDisplay: {
		type: 'string',
		default: '',
	},
	publisherFlexDirection: {
		type: 'object',
		default: { value: 'row', reverse: false },
	},
	publisherAlignItems: {
		type: 'string',
		default: '',
	},
	publisherJustifyContent: {
		type: 'string',
		default: '',
	},
	publisherGap: {
		type: 'object',
		default: { lock: true, gap: '', columns: '', rows: '' },
	},
	publisherFlexWrap: {
		type: 'object',
		default: { value: 'nowrap', reverse: false },
	},
	publisherAlignContent: {
		type: 'string',
		default: '',
	},
};
