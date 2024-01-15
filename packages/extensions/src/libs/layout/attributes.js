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
	publisherGridAlignItems: {
		type: 'string',
		default: '',
	},
	publisherGridJustifyItems: {
		type: 'string',
		default: '',
	},

	publisherGridAlignContent: {
		type: 'string',
		default: '',
	},
	publisherGridJustifyContent: {
		type: 'string',
		default: '',
	},
	publisherGridGap: {
		type: 'object',
		default: { lock: true, gap: '20px', columns: '', rows: '' },
	},
	publisherGridDirection: {
		type: 'object',
		default: { value: '', dense: false },
	},
	publisherGridColumns: {
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
	publisherGridRows: {
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
	publisherGridAreas: {
		type: 'array',
		default: [],
	},
};
