// Edit packages/global-packages/packages/dev-tools/root-configs/jest.config.js
// project:bootstrap copies this to every consumer root.
/**
 * Consumer Jest: GP packages listed in this product's package.json
 * `dependencies` and `devDependencies` (`@blockera/*` file:). Overlay
 * packages that only exist on disk after a submodule bump are not included.
 */
const fs = require('fs');
const path = require('path');

const base = require('./packages/global-packages/packages/dev-jest/js/jest.config.js');

function declaredPackageRoots(rootDir) {
	const helper = path.join(
		rootDir,
		'packages/global-packages/packages/dev-tools/js/consumer-packages/resolve-gp-packages.js'
	);

	if (fs.existsSync(helper)) {
		const { createConsumerJestConfig } = require(helper);
		return createConsumerJestConfig(rootDir, base);
	}

	const pkg = JSON.parse(
		fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')
	);
	const roots = Object.entries(pkg.dependencies || {})
		.filter(
			([name, spec]) =>
				name.startsWith('@blockera/') &&
				typeof spec === 'string' &&
				spec.startsWith('file:')
		)
		.map(([, spec]) =>
			path.resolve(
				rootDir,
				spec.replace(/^file:/, '').replace(/^\.\//, '')
			)
		)
		.filter((dir) => fs.existsSync(dir));

	return {
		...base,
		roots,
		collectCoverageFrom: roots.map((root) => `${root}/**/*.js`),
	};
}

module.exports = declaredPackageRoots(__dirname);
