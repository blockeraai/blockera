/**
 * Internal dependencies
 */
import extension from './extension.json';

export default {
	...extension,
	Edit: ({ children }) => {
		return <div>{children}</div>;
	},
	Save: ({ element }) => {
		return element;
	},
};
