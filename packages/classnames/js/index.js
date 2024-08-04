/**
 * External dependencies
 */
import { clsx } from 'clsx';
import {
	isArray,
	isEmpty,
	isObject,
	isString,
	isUndefined,
} from '@blockera/utils';

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
	if (isString(items) && !isEmpty(items)) {
		items = section + '-' + items;
	} else if (isArray(items)) {
		// prepend section to first item
		items[0] = prepareClassName(section, items[0]);
	} else if (isObject(items)) {
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

export function classNames(...names) {
	return clsx(names);
}

export function getClassnames(
	addSectionClass = true,
	section = rootDefault,
	names
) {
	// find the section prefix from its default
	if (isObject(section)) {
		section = Object.keys(section)[0];
	}

	if (!isString(section)) {
		section = 'blockera';
	}

	// return only section
	if (isUndefined(names) || isEmpty(names)) {
		return clsx(section);
	}

	// prepend section prefix to all classes
	names = prepareClassName(section, names);

	if (addSectionClass) {
		return clsx(section, names);
	}

	return clsx(names);
}

export function getClassNames(...names) {
	return getClassnames(true, rootDefault, names);
}

export function getInnerClassNames(...names) {
	return getClassnames(false, rootDefault, names);
}

export function controlClassNames(...names) {
	return getClassnames(true, controlsDefault, names);
}

export function controlInnerClassNames(...names) {
	return getClassnames(false, controlsDefault, names);
}

export function fieldsClassNames(...names) {
	return getClassnames(true, fieldsDefault, names);
}

export function fieldsInnerClassNames(...names) {
	return getClassnames(false, fieldsDefault, names);
}

export function componentClassNames(...names) {
	return getClassnames(true, componentsDefault, names);
}

export function componentInnerClassNames(...names) {
	return getClassnames(false, componentsDefault, names);
}

export function extensionClassNames(...names) {
	return getClassnames(true, extensionsDefault, names);
}

export function extensionInnerClassNames(...names) {
	return getClassnames(false, extensionsDefault, names);
}
