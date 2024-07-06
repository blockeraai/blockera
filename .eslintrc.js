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
	{
		name: 'classnames',
		message:
			"Please use `classNames` function or other functions from `@blockera/classnames` instead. It's a lighter, faster and is compatible all Blockera packages.",
	},
	{
		name: 'clx',
		message:
			"Please use `classNames` function or other functions from `@blockera/classnames` instead. It's a lighter, faster and is compatible all Blockera packages.",
	},
	{
		name: 'clsx',
		message:
			"Please use `classNames` function or other functions from `@blockera/classnames` instead. It's a lighter, faster and is compatible all Blockera packages.",
	},
	{
		name: 'prop-types',
		message:
			'`prop-types` is not recommended. Please use TypeScript or Flow.js for type checking.',
	},
	{
		name: 'framer-motion',
		message:
			'Please use the Framer Motion API through `@wordpress/components` instead. (__unstableMotion, __unstableAnimatePresence and __unstableMotionContext)',
	},
	{
		name: '@ariakit/react',
		message:
			'Please use Ariakit API through `@wordpress/components` instead.',
	},
	{
		name: '@ariakit/react',
		message:
			'Please use Ariakit API through `@wordpress/components` instead. (__unstableComposite, __unstableCompositeGroup, __unstableCompositeItem and __unstableUseCompositeState)',
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
		'@wordpress/i18n-text-domain': [
			'error',
			{
				allowedTextDomain: ['blockera'],
			},
		],
	},
	env: {
		jest: true,
	},
};
