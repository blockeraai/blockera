export const attributes = {
	publisherOpacity: {
		type: 'string',
		default: '100%',
	},
	publisherTransform: {
		type: 'object',
		default: {},
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
		type: 'object',
		default: {},
	},
	publisherFilter: {
		type: 'object',
		default: {},
	},
	publisherBackdropFilter: {
		type: 'object',
		default: {},
	},
	publisherDivider: {
		type: 'object',
		default: {},
	},
	publisherMask: {
		type: 'object',
		default: {},
	},
	publisherBlendMode: {
		type: 'string',
		default: 'normal',
	},
};
