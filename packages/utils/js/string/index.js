// @flow

export function ucFirstWord(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getPascalCase(str: string): string {
	return str.replace(/(\w)(\w*)/g, function (_, first, rest) {
		return first.toUpperCase() + rest.toLowerCase();
	});
}

export function getCamelCase(str: string, removePart: string): string {
	if (removePart) {
		str = str.replace(removePart, '');
	}

	return str.substring(0, 1).toLowerCase() + str.substring(1, str.length);
}

export function isJSONString(str: string): boolean {
	try {
		return JSON.parse(str);
	} catch (error) {
		return str;
	}
}
