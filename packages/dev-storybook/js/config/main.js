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
		'@storybook/addon-webpack5-compiler-babel',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	tags: ['autodocs'],
	async webpackFinal(config) {
		// Remove the existing svg rule
		config.module.rules = config.module.rules?.filter((rule) => {
			if (rule.test && rule.test.toString().includes('svg')) {
				return false;
			}
			return true;
		});

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
			},
			{
				test: /packages\/.*\.svg$/,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
			}
		);

		return config;
	},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
	},
};
export default config;
