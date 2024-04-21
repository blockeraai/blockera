export const attributes = {
	publisherDisplay: {
		type: 'string',
		default: '',
	},
	publisherFlexLayout: {
		type: 'object',
		default: { direction: 'row', alignItems: '', justifyContent: '' },
	},
	publisherGap: {
		type: 'object',
		default: { lock: true, gap: '', columns: '', rows: '' },
	},
	publisherFlexWrap: {
		type: 'object',
		default: { value: '', reverse: false },
	},
	publisherAlignContent: {
		type: 'string',
		default: '',
	},
};
