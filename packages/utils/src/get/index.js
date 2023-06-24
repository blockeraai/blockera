import { prepare } from '@publisher/data-extractor';

/**
 * It splits the path into an array of keys and iterates over them to traverse the object and retrieve the value at the specified path.
 * If the value is not found, it returns the default value.
 *
 * @param {Object} object the origin object.
 * @param {string|Array<string>} path the path of feature of original object
 * @param {*} defaultValue the default value when was not found path of object!
 * @return {*} the path value or default value!
 */
export const get = (object, path, defaultValue) => {
	return prepare(path, object) ?? defaultValue;
};
