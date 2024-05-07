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

	blockeraGridAlignItems: {
		type: 'string',
		default: '',
	},
	blockeraGridJustifyItems: {
		type: 'string',
		default: '',
	},
	blockeraGridGap: {
		type: 'object',
		default: { lock: true, gap: '20px', columns: '', rows: '' },
	},
	blockeraGridDirection: {
		type: 'object',
		default: { value: 'row', dense: false },
	},
	blockeraGridColumns: {
		type: 'object',
		default: {
			length: 2,
			value: [
				{
					'sizing-mode': 'normal',
					size: '1fr',
					'min-size': '',
					'max-size': '',
					'auto-fit': false,
					id: 1,
				},
				{
					'sizing-mode': 'normal',
					size: '1fr',
					'min-size': '',
					'max-size': '',
					'auto-fit': false,
					id: 2,
				},
			],
		},
	},
	blockeraGridRows: {
		type: 'object',
		default: {
			length: 2,
			value: [
				{
					'sizing-mode': 'normal',
					size: 'auto',
					'min-size': '',
					'max-size': '',
					'auto-fit': false,
					id: 1,
				},
				{
					'sizing-mode': 'normal',
					size: 'auto',
					'min-size': '',
					'max-size': '',
					'auto-fit': false,
					id: 2,
				},
			],
		},
	},
	blockeraGridAreas: {
		type: 'array',
		default: [],
	},
};
