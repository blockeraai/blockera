// @flow

import { prepare } from '@blockera/data-extractor';

/**
 * It splits the path into an array of keys and iterates over them to traverse the object and retrieve the value at the specified path.
 * If the value is not found, it returns the default value.
 *
 * @param {Object} object the origin object.
 * @param {string|Array<string>} path the path of feature of original object
 * @param {*} defaultValue the default value when was not found path of object!
 * @return {*} the path value or default value!
 */
export const get = (object: Object, path: string, defaultValue: any): any => {
	return prepare(path, object) ?? defaultValue;
};

/**
 * Retrieve iframe content tag element with css selector.
 *
 * @param {string} selector the css selector.
 *
 * @return {HTMLElement|void} the iframe content document body element.
 */
export const getIframeTag = (selector: string): HTMLElement | void => {
	return (
		document
			.querySelector('iframe[name="editor-canvas"]')
			// $FlowFixMe
			?.contentDocument?.querySelector(selector)
	);
};
