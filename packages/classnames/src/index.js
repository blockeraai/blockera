/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import rootDefault from './defaults/root.json';
import controlsDefault from './defaults/controls.json';
import componentsDefault from './defaults/components.json';
import extensionsDefault from './defaults/extensions.json';

export function getClassNames(...names) {
	return classnames(rootDefault, names);
}

export function controlClassNames(...names) {
	return classnames(controlsDefault, names);
}

export function componentClassNames(...names) {
	return classnames(componentsDefault, names);
}

export function extensionClassNames(...names) {
	return classnames(extensionsDefault, names);
}
