/* eslint-disable sort-keys */
module.exports = {
	rootDir: '../../../',
	preset: '@wordpress/jest-preset-default',
	collectCoverageFrom: ['<rootDir>/packages/**/*.js'],
	setupFiles: ['<rootDir>/packages/dev-jest/js/setup-text-encoding.js'],
	setupFilesAfterEnv: [
		require.resolve('@wordpress/jest-preset-default/scripts/setup-globals.js'),
	],
	modulePathIgnorePatterns: [],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/source-code-block-editor/',
		'/source-code-wordpress/',
	],
	testMatch: ['**/test/**/*.spec.js', '**/tests/**/*.spec.js'],
	transformIgnorePatterns: ['/node_modules/(?!parsel-js|client-zip).+\\.js$'],
	transform: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/packages/dev-jest/js/assets-transformer.js',
		'\\.svg$': '<rootDir>/packages/dev-jest/js/svg-transformer.js',
		'\\.css$': '<rootDir>/packages/dev-jest/js/css-raw-transformer.js',
		'^.+\\.(js|jsx)$': 'babel-jest',
		'^.+\\.[jt]sx?$': 'babel-jest',
	},
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	moduleNameMapper: {
		'^@blockera/experimental-config$': '<rootDir>/experimental.config.json',
		// Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
		uuid: require.resolve('uuid'),
		'\\.svg$': '<rootDir>/packages/dev-jest/js/__mocks__/svg-mock.js',
		// Map CSS files with ?raw suffix to the actual CSS file path
		// Jest will strip the ?raw query string, then the css-raw-transformer will handle it
		'^(.+\\.css)\\?raw$': '$1',
	},
};
