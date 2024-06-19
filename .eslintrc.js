const restrictedImports = [
	{
		name: 'lodash-es',
		message:
			'This Lodash is not recommended. Please use native functionality instead.',
	},
	{
		name: 'lodash',
		message:
			'This Lodash is not recommended. Please use native functionality instead.',
	},
];

module.exports = {
	parser: 'hermes-eslint',
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:cypress/recommended',
		'plugin:ft-flow/recommended',
	],
	rules: {
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
		'@wordpress/i18n-no-collapsible-whitespace': 'off',
		'import/no-extraneous-dependencies': 'off',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'@wordpress/no-base-control-with-label-without-id': 'off',
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
		'no-restricted-imports': [
			'error',
			{
				paths: restrictedImports,
			},
		],
	},
	env: {
		jest: true,
	},
};
