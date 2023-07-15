module.exports = function (api) {
	// Cache the returned value forever and don't call this function again.
	api.cache(true);

	return {
		presets: [
			'@babel/preset-env',
			['@babel/preset-react', { runtime: 'automatic' }],
			'@babel/preset-flow',
			'@wordpress/babel-preset-default',
		],
		plugins: [
			'macros',
			'@babel/plugin-proposal-class-properties',
			'@babel/plugin-proposal-export-default-from',
			[
				'@babel/plugin-transform-runtime',
				{
					regenerator: true,
				},
			],
		],
	};
};
