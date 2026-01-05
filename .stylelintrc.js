const postcssScss = require('postcss-scss');
const wpConfig = require('@wordpress/stylelint-config');

module.exports = {
	...wpConfig,
	rules: {
		...(wpConfig.rules || {}),
		'string-quotes': 'double',
		'function-url-quotes': 'always',
		'no-descending-specificity': null,
		'selector-class-pattern': null,
		indentation: null,
		'color-hex-length': 'long',
		'comment-empty-line-before': null,
		'value-keyword-case': null,
		'rule-empty-line-before': null,
	},
	ignoreFiles: [
		...(wpConfig.ignoreFiles || []),
		'coverage/**/*.css',
		'packages/dev-cypress/**/*.css',
		'packages/dev-cypress/**/*.scss',
		'packages/dev-storybook/**/*.css',
		'packages/dev-storybook/**/*.scss',
		'packages/blockera-admin/js/style.scss',
	],
	customSyntax: postcssScss, // MUST be last to prevent override
};
