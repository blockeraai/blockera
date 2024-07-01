const hash = require('string-hash');

module.exports = {
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					removeViewBox: false,
				},
			},
		},
		{
			name: 'prefixIds',
			params: {
				prefix(element, filepath) {
					return `blockera-svg-${hash(filepath?.path)}`;
				},
			},
		},
	],
};
