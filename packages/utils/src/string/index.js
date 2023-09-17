export function ucFirstWord(word: string) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getPascalCase(str) {
	return str.replace(/(\w)(\w*)/g, function (_, first, rest) {
		return first.toUpperCase() + rest.toLowerCase();
	});
}

export function getCamelCase(str, removePart) {
	if (removePart) {
		str = str.replace(removePart, '');
	}

	return str.substring(0, 1).toLowerCase() + str.substring(1, str.length);
}
