/**
 * Internal dependencies
 */
import migrate from './migrate';
import extension from './extension.json';

export default {
	migrate,
	...extension,
	edit: ({ children }) => {
		return <div>{children}</div>;
	},
};
