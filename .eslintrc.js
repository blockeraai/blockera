module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:cypress/recommended',
	],
	rules: {
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
		'import/no-extraneous-dependencies': 'off',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'jsdoc/check-line-alignment': 'off',
		'jsdoc/require-param': 'off',
		'jsdoc/check-param-names': 'off',
		'no-shadow': 'off',
		'no-console': 'off',
		'no-restricted-syntax': [
			'error',
			{
				selector:
					"CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
				message: 'Unexpected property on console object was called',
			},
		],
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
	},
	env: {
		jest: true,
	},
};
