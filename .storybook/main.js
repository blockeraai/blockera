import { defaultConfig } from '@publisher/storybook';

export default {
	stories: [
		'../packages/controls/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/components/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
		'../packages/extensions/src/**/stories/*.stories.@(js|jsx|ts|tsx)',
	],
	...defaultConfig,
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
