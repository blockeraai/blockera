// @flow

import { isEquals } from '../array';

export function truthy(expression: string, data: object): boolean {
	const [key, value] = expression.split('=');

	if (!key || !value) {
		return false;
	}

	const substring = key.slice(0, -1);

	if (data.hasOwnProperty(substring)) {
		if (key.endsWith('*')) {
			return data[substring].includes(value);
		} else if (key.endsWith('^')) {
			return data[substring].startsWith(value);
		} else if (key.endsWith('$')) {
			return data[substring].endsWith(value);
		}
	}

	return isEquals(data[key], value);
}
