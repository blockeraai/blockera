/**
 * External dependencies
 */
const glob = require('glob');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const styleEntries = {};
const editorIframeStyles = {};
const styleFiles = glob.sync('./packages/**/*.scss');

function getPackage(name) {
	const packageFiles = [];

	styleFiles.forEach((file) => {
		if (-1 === file.indexOf(name)) {
			return;
		}

		packageFiles.push(file);
	});

	return packageFiles;
}

styleFiles.map((currentEntry) => {
	if (
		/editor-\w+.scss/.test(currentEntry) &&
		-1 !== currentEntry.indexOf('packages/editor/')
	) {
		Object.assign(editorIframeStyles, {
			'editor-styles': [
				...(editorIframeStyles['editor-styles'] || []),
				currentEntry,
			],
		});
	}

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

			Object.assign(styleEntries, {
				[`${match}-styles`]: getPackage(match),
			});
		});
	}

	return currentEntry;
});

module.exports = {
	entry: {
		...styleEntries,
		...editorIframeStyles,
	},
	optimization: {
		minimizer: [new CssMinimizerPlugin()],
	},
};
