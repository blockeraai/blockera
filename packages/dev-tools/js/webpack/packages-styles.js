/**
 * External dependencies
 */
const glob = require('glob');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const styleEntries = {};
const editorIframeStyles = {};
const styleFiles = glob.sync('./packages/**/*.scss');

styleFiles.forEach((currentEntry) => {
	const regex = new RegExp('packages\\/(\\w+(?:-\\w+|))', 'g');

	let m;

	while ((m = regex.exec(currentEntry)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			if (groupIndex !== 1) {
				return;
			}

			// Exclude dev packages.
			if (-1 !== match.indexOf('dev-')) {
				return;
			}

			Object.assign(styleEntries, {
				[`${match}-styles`]: [
					...(styleEntries[`${match}-styles`] || []),
					currentEntry,
				],
			});
		});
	}
});

module.exports = {
	entry: {
		...Object.fromEntries(
			Object.entries(styleEntries).filter(([, entry]) => entry.length)
		),
		...editorIframeStyles,
	},
	optimization: {
		minimizer: [new CssMinimizerPlugin()],
	},
};
