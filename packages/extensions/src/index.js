/**
 * Internal dependencies
 */
import { getExtensions } from './libs';
import { getFields } from '@publisher/fields';
import { registerBlockExtension } from './api';

const register = ({ name, ...extension }) =>
	registerBlockExtension(name, extension);

function initExtensions() {
	getExtensions().forEach(register);
	getFields().forEach(register);
}

initExtensions();

export { store } from './store';
export * from './api';
export { getExtensions } from './libs';
export { default as applyHooks } from './hooks';
