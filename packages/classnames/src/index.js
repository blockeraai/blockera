/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import rootDefault from './defaults/root.json';
import controlsDefault from './defaults/controls.json';
import fieldsDefault from './defaults/fields.json';
import componentsDefault from './defaults/components.json';
import extensionsDefault from './defaults/extensions.json';

// recursive
// items supported types: String, Object, Array
function prepareClassName(section, items) {
	if (
		(typeof items === 'string' || items instanceof String) &&
		items !== ''
	) {
		items = (section + '-' + items).replaceAll(' ', ' ' + section + '-');
	} else if (Array.isArray(items)) {
		for (let i = 0; i < items.length; i++) {
			items[i] = prepareClassName(section, items[i]);
		}
	} else if (typeof items === 'object') {
		Object.keys(items).forEach((key) => {
			items[section + '-' + key] = prepareClassName(section, items[key]);
			delete items[key];
		});
	}
	return items;
}

function _classnames(section = rootDefault, names) {
	// find the section prefix from it's default
	if (typeof section !== 'string') {
		section = Object.keys(section)[0];
	}

	// prepend section prefix to all classes
	names = prepareClassName(section, names);

	return classnames(section, names);
}

export function getClassNames(...names) {
	return _classnames(rootDefault, names);
}

export function controlClassNames(...names) {
	return _classnames(controlsDefault, names);
}

export function fieldsClassNames(...names) {
	return _classnames(fieldsDefault, names);
}

export function componentClassNames(...names) {
	return _classnames(componentsDefault, names);
}

export function extensionClassNames(...names) {
	return _classnames(extensionsDefault, names);
}
