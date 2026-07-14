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
			// Match both repo-relative and multi-root workspace paths.
			files: ['*.html', '**/*.html', '**/tests/**/*.html'],
			options: {
				// Keep WP block fixture markup compact: one-line attributes + inline CSS.
				printWidth: 9999,
				htmlWhitespaceSensitivity: 'ignore',
				singleAttributePerLine: false,
				bracketSameLine: true,
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
