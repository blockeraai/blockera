/* eslint-disable sort-keys */
module.exports = {
	rootDir: '../../../',
	preset: '@wordpress/jest-preset-default',
	collectCoverageFrom: ['<rootDir>/packages/**/*.js'],
	setupFilesAfterEnv: [
		require.resolve(
			'@wordpress/jest-preset-default/scripts/setup-globals.js'
		),
	],
	modulePathIgnorePatterns: [],
	testMatch: ['**/test/**/*.spec.js', '**/tests/**/*.spec.js'],
	transform: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/packages/dev-jest/js/assets-transformer.js',
		'\\.svg$': '<rootDir>/packages/dev-jest/js/svg-transformer.js',
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	moduleNameMapper: {
		// Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
		uuid: require.resolve('uuid'),
		'\\.svg$': '<rootDir>/packages/dev-jest/js/__mocks__/svg-mock.js',
	},
};
