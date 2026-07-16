/* eslint-disable sort-keys */
module.exports = {
	rootDir: '../../../',
	preset: '@wordpress/jest-preset-default',
	collectCoverageFrom: ['<rootDir>/packages/**/*.js'],
	setupFiles: [
		'<rootDir>/packages/dev-jest/js/setup-text-encoding.js',
		'<rootDir>/packages/dev-jest/js/setup-jsdom-css.js',
	],
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
	transformIgnorePatterns: [
		'/node_modules/(?!(.*@wordpress/theme|parsel-js|client-zip|marked)).*\\.(js|jsx|mjs|cjs|ts|tsx)$',
	],
	transform: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/packages/dev-jest/js/assets-transformer.js',
		'\\.svg$': '<rootDir>/packages/dev-jest/js/svg-transformer.js',
		'\\.css$': '<rootDir>/packages/dev-jest/js/css-raw-transformer.js',
		'^.+\\.(js|jsx|mjs|cjs)$': 'babel-jest',
		'^.+\\.[jt]sx?$': 'babel-jest',
	},
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	moduleNameMapper: {
		'^@blockera/experimental-config$': '<rootDir>/experimental.config.json',
		'^@wordpress/theme/build-module/index\\.mjs$':
			'<rootDir>/packages/dev-jest/js/__mocks__/wordpress-theme.js',
		'^@wordpress/theme/build-module/private-apis\\.mjs$':
			'<rootDir>/packages/dev-jest/js/__mocks__/wordpress-theme.js',
		'.*/editor/header-ui/components/breakpoints/bootstrap\\.js$':
			'<rootDir>/packages/dev-jest/js/__mocks__/bootstrap-breakpoints.js',
		// Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
		uuid: require.resolve('uuid'),
		'\\.svg$': '<rootDir>/packages/dev-jest/js/__mocks__/svg-mock.js',
		// Map CSS files with ?raw suffix to the actual CSS file path
		// Jest will strip the ?raw query string, then the css-raw-transformer will handle it
		'^(.+\\.css)\\?raw$': '$1',
	},
};
