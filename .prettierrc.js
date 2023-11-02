const wpConfig = require('@wordpress/prettier-config');

module.exports = {
	...wpConfig,
	overrides: [
		{
			files: '*.{css,sass,scss}',
			options: {
				singleQuote: false,
			},
		},
	],
};
