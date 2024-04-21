export const attributes = {
	blockeraOpacity: {
		type: 'string',
		default: '100%',
	},
	blockeraTransform: {
		type: 'object',
		default: {},
	},
	blockeraTransformSelfPerspective: {
		type: 'string',
		default: '',
	},
	blockeraTransformSelfOrigin: {
		type: 'object',
		default: { top: '', left: '' },
	},
	blockeraBackfaceVisibility: {
		type: 'string',
		default: 'visible',
	},
	blockeraTransformChildPerspective: {
		type: 'string',
		default: '',
	},
	blockeraTransformChildOrigin: {
		type: 'object',
		default: { top: '', left: '' },
	},
	blockeraTransition: {
		type: 'object',
		default: {},
	},
	blockeraFilter: {
		type: 'object',
		default: {},
	},
	blockeraBackdropFilter: {
		type: 'object',
		default: {},
	},
	blockeraDivider: {
		type: 'object',
		default: {},
	},
	blockeraMask: {
		type: 'object',
		default: {},
	},
	blockeraBlendMode: {
		type: 'string',
		default: 'normal',
	},
};
