module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'eslint:recommended',
		'plugin:react/recommended',
	],

	// PublisherBlocks config
	env: {
		browser: true,
		'cypress/globals': true,
		jest: true,
	},

	plugins: [ 'cypress', 'react' ],

	// Specific Globals used in PublisherBlocks
	globals: {
		page: true,
	},

	rules: {
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
		'@wordpress/no-unsafe-wp-apis': 'off',
		'react/react-in-jsx-scope': 'off',
		'no-mixed-spaces-and-tabs': 'off',
	},
};
