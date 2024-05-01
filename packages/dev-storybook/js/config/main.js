// eslint-disable-next-line jsdoc/valid-types
/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
	addons: [
		'@storybook/react',
		'@storybook/addon-a11y',
		'storybook-source-link',
		'@storybook/addon-jest',
		'@storybook/addon-links',
		'@storybook/addon-actions',
		'@storybook/addon-toolbars',
		'@storybook/addon-viewport',
		'@storybook/addon-controls',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	async webpackFinal(config, { configType }) {
		if (configType === 'DEVELOPMENT') {
			//TODO: config for development if necessary
		}
		if (configType === 'PRODUCTION') {
			//TODO: config for production if necessary
		}

		// shared config
		config.module.rules.push(
			{
				test: /\.scss$/,
				exclude: /\.lazy\.scss$/,
				use: [
					{
						loader: 'style-loader',
						options: { injectType: 'styleTag' },
					},
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.lazy\.scss$/,
				use: [
					{
						loader: 'style-loader',
						options: { injectType: 'lazyStyleTag' },
					},
					'css-loader',
					'sass-loader',
				],
			}
		);

		return config;
	},
};
export default config;
