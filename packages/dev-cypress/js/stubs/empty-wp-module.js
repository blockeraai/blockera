/**
 * Empty stub for WordPress packages that component tests do not exercise.
 * Prevents webpack from compiling broken nested deps under packages such as
 * `@wordpress/dataviews` and `@wordpress/commands`.
 */
const stub = new Proxy(
	{},
	{
		get(_target, prop) {
			if (prop === '__esModule') {
				return true;
			}

			if (prop === 'default' || prop === 'store') {
				return stub;
			}

			return () => null;
		},
	}
);

module.exports = stub;
