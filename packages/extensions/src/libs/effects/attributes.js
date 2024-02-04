export const attributes = {
	publisherOpacity: {
		type: 'string',
		default: '100%',
	},
	publisherTransform: {
		type: 'array',
		default: [],
	},
	publisherTransformSelfPerspective: {
		type: 'string',
		default: '',
	},
	publisherTransformSelfOrigin: {
		type: 'object',
		default: { top: '', left: '' },
	},
	publisherBackfaceVisibility: {
		type: 'string',
		default: 'visible',
	},
	publisherTransformChildPerspective: {
		type: 'string',
		default: '',
	},
	publisherTransformChildOrigin: {
		type: 'object',
		default: { top: '', left: '' },
	},
	publisherTransition: {
		type: 'array',
		default: [],
	},
	publisherFilter: {
		type: 'array',
		default: [],
	},
	publisherBackdropFilter: {
		type: 'array',
		default: [],
	},
	publisherDivider: {
		type: 'array',
		default: [],
	},
	publisherMask: {
		type: 'array',
		default: [],
	},
	publisherBlendMode: {
		type: 'string',
		default: 'normal',
	},
};
