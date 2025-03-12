module.exports = {
	plugins: [
		require('@wordpress/postcss-plugins-preset'),
		require('postcss-sorting')({
			order: [
				'custom-properties',
				'dollar-variables',
				'declarations',
				'at-rules',
				'rules',
			],
			'properties-order': 'alphabetical',
			'unspecified-properties-position': 'bottom',
		}),
	],
};
