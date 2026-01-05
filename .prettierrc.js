const wpConfig = require('@wordpress/prettier-config');

module.exports = {
	...wpConfig,
	endOfLine: 'auto',
	overrides: [
		{
			files: '*.{css,sass,scss}',
			options: {
				singleQuote: false,
			},
		},
	],
};
