export const attributes = {
	publisherFontColor: {
		type: 'string',
		default: '',
	},
	publisherFontSize: {
		type: 'string',
		default: '',
	},
	publisherLineHeight: {
		type: 'string',
		default: '',
	},
	publisherTextAlign: {
		type: 'string',
		default: '',
	},
	publisherTextDecoration: {
		type: 'string',
		default: '',
	},
	publisherFontStyle: {
		type: 'string',
		default: '',
	},
	publisherTextTransform: {
		type: 'string',
		default: '',
	},
	publisherDirection: {
		type: 'string',
		default: '',
	},
	publisherTextShadow: {
		type: 'array',
		default: [],
	},
	publisherLetterSpacing: {
		type: 'string',
		default: '',
	},
	publisherWordSpacing: {
		type: 'string',
		default: '',
	},
	publisherTextIndent: {
		type: 'string',
		default: '',
	},
	publisherTextOrientation: {
		type: 'object',
		default: { 'writing-mode': '', 'text-orientation': '' },
	},
	publisherTextColumns: {
		type: 'object',
		default: {
			columns: '',
			gap: '',
			divider: {
				width: '',
				color: '',
				style: 'solid',
			},
		},
	},
	publisherTextStrokeWidth: {
		type: 'string',
		default: '',
	},
	publisherTextStrokeColor: {
		type: 'string',
		default: '',
	},
	publisherWordBreak: {
		type: 'string',
		default: 'normal',
	},
};
