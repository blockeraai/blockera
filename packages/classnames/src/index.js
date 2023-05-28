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

function _classnames(addSectionClass = true, section = rootDefault, names) {
	// find the section prefix from it's default
	if (typeof section !== 'string') {
		section = Object.keys(section)[0];
	}

	// prepend section prefix to all classes
	names = prepareClassName(section, names);

	if (addSectionClass) {
		return classnames(section, names);
	}

	return classnames(names);
}

export function getClassNames(...names) {
	return _classnames(true, rootDefault, names);
}

export function getInnerClassNames(...names) {
	return _classnames(false, rootDefault, names);
}

export function controlClassNames(...names) {
	return _classnames(true, controlsDefault, names);
}

export function controlInnerClassNames(...names) {
	return _classnames(false, controlsDefault, names);
}

export function fieldsClassNames(...names) {
	return _classnames(true, fieldsDefault, names);
}

export function fieldsInnerClassNames(...names) {
	return _classnames(false, fieldsDefault, names);
}

export function componentClassNames(...names) {
	return _classnames(true, componentsDefault, names);
}

export function componentInnerClassNames(...names) {
	return _classnames(false, componentsDefault, names);
}

export function extensionClassNames(...names) {
	return _classnames(true, extensionsDefault, names);
}

export function extensionInnerClassNames(...names) {
	return _classnames(false, extensionsDefault, names);
}
