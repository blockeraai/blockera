export const attributes = {
	blockeraDisplay: {
		type: 'string',
		default: '',
	},
	blockeraFlexLayout: {
		type: 'object',
		default: { direction: 'row', alignItems: '', justifyContent: '' },
	},
	blockeraGap: {
		type: 'object',
		default: { lock: true, gap: '', columns: '', rows: '' },
	},
	blockeraFlexWrap: {
		type: 'object',
		default: { value: '', reverse: false },
	},
	blockeraAlignContent: {
		type: 'string',
		default: '',
	},
};
