const { transformSync } = require('@babel/core');
const svgr = require('@svgr/core').default;

module.exports = {
	process(src, filename) {
		const svgCode = svgr.sync(src, { filename });
		const { code } = transformSync(svgCode, {
			filename,
			presets: ['@babel/preset-env', '@babel/preset-react'],
		});
		return code;
	},
};
