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
			'<rootDir>/.dev/tests/jest/assets-transformer.js',
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
};
