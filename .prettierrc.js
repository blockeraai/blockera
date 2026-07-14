const wpConfig = require('@wordpress/prettier-config');

module.exports = {
	...wpConfig,
	endOfLine: 'auto',
	useTabs: true,
	overrides: [
		{
			files: '*.{css,sass,scss}',
			options: {
				singleQuote: false,
			},
		},
		{
			files: '*.svg',
			options: {
				parser: 'html',
				printWidth: 80,
				tabWidth: 2,
				useTabs: true,
			},
		},
		{
			files: '*.xml',
			options: {
				parser: 'html',
				printWidth: 80,
				tabWidth: 2,
				useTabs: true,
			},
		},
	],
};
