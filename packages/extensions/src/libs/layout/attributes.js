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
		default: { lock: true, gap: '', columns: '', rows: '' },
	},
	publisherGridDirection: {
		type: 'object',
		default: { value: '', dense: false },
	},
	publisherGridColumns: {
		type: 'array',
		default: [
			{
				'sizing-mode': 'normal',
				size: '1fr',
				'min-size': '200px',
				'max-size': '1fr',
				'auto-fit': false,
				isVisible: true,
			},
			{
				'sizing-mode': 'normal',
				size: '1fr',
				'min-size': '200px',
				'max-size': '1fr',
				'auto-fit': false,
				isVisible: true,
			},
			{
				'sizing-mode': 'normal',
				size: '1fr',
				'min-size': '200px',
				'max-size': '1fr',
				'auto-generated': true,
				isVisible: true,
				deletable: false,
				cloneable: false,
			},
		],
	},
	publisherGridRows: {
		type: 'array',
		default: [
			{
				'sizing-mode': 'normal',
				size: '1fr',
				'min-size': '200px',
				'max-size': '1fr',
				'auto-fit': false,
				isVisible: true,
			},
			{
				'sizing-mode': 'normal',
				size: '1fr',
				'min-size': '200px',
				'max-size': '1fr',
				'auto-fit': false,
				isVisible: true,
			},
			{
				'sizing-mode': 'normal',
				size: '1fr',
				'min-size': '200px',
				'max-size': '1fr',
				'auto-generated': true,
				isVisible: true,
				deletable: false,
				cloneable: false,
			},
		],
	},
	publisherGridAreas: {
		type: 'array',
		default: [],
	},
};
