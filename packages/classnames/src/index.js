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
		items = section + '-' + items;
	} else if (Array.isArray(items)) {
		// prepend section to first item
		items[0] = prepareClassName(section, items[0]);
	} else if (typeof items === 'object') {
		let first = true;
		const newItems = [];

		Object.keys(items).forEach((key) => {
			if (items[key] === true) {
				if (first === true) {
					newItems.push(prepareClassName(section, key));

					first = false;
				} else {
					newItems.push(key);
				}
			}
		});

		items = newItems;
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
