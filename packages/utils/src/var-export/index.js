import {
	isArray,
	isBoolean,
	isNull,
	isNumber,
	isObject,
	isString,
	isUndefined,
} from '../is';

export function varExport(value, indent = '') {
	if (isString(value)) {
		return indent + "'" + value.replace(/'/g, "\\'") + "'";
	} else if (isNumber(value) || isBoolean(value)) {
		return indent + value.toString();
	} else if (isUndefined(value)) {
		return indent + 'undefined';
	} else if (isNull(value)) {
		return indent + 'null';
	} else if (isArray(value)) {
		const elements = value
			.map((el) => varExport(el, indent + '    '))
			.join(',\n');
		return indent + '[\n' + elements + '\n' + indent + ']';
	} else if (isObject(value)) {
		const keys = Object.keys(value);
		const properties = keys
			.map((key) => {
				const propertyValue = varExport(value[key], indent + '\t');
				return indent + '    ' + key + ': ' + propertyValue;
			})
			.join(',\n');
		return '{\n' + properties + '\n' + indent + '}';
	}

	return '';
}
