/**
 * External dependencies
 */
const glob = require('glob');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const styleEntries = {};
const files = [];

glob.sync('./packages/**/*.scss').map((currentEntry) => {
	const regex = new RegExp('packages\\/(\\w+)', 'g');

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
			files.push(currentEntry);

			Object.assign(styleEntries, {
				[match]: files,
			});
		});
	}

	return currentEntry;
});

module.exports = {
	entry: styleEntries,
	optimization: {
		minimizer: [new CssMinimizerPlugin()],
	},
};
