/**
 * External dependencies
 */
import classnames from 'classnames';
import { isArray, isObject, isString } from 'lodash';

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

/**
 * Merged default context classnames with additional classnames
 *
 * @param {Array<Object|string|Array>} names The additional classnames
 * @param {Object} defaultValues The default values of context
 * @returns {Object} classnames with additional items as object
 */
export function mergeClasses(
	names: Array<Objcet | string | Array>,
	defaultValues: Object
): Object {
	names?.forEach((name) => {
		if (isString(name)) {
			name.split(' ')?.forEach((item) => {
				if (defaultValues[item]) {
					return;
				}

				defaultValues[item] = true;
			});

			return;
		}

		if (isArray(name)) {
			name.forEach((item) => {
				if (defaultValues[item]) {
					return;
				}

				defaultValues[item] = true;
			});

			return;
		}

		if (isObject(name)) {
			Object.keys(name).forEach((item) => {
				if (defaultValues[item]) {
					return;
				}

				if (defaultValues[item] === name[item]) {
					return;
				}

				defaultValues[item] = name[item];
			});
		}
	});

	return classnames(defaultValues);
}
