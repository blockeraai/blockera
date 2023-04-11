export function isValid(icon, iconLibrary, excluded = []) {
	if (!icon || !iconExists(icon, iconLibrary)) {
		return false;
	}

	if (excluded.includes(icon)) {
		return false;
	}

	return true;
}

export function ignoreNullValue(icon) {
	return null !== icon;
}

function iconExists(iconName, lib) {
	const entries = Object.entries(lib);

	for (let index = 0; index < entries.length; index++) {
		let element = entries[index];

		if (iconName === element[1]) {
			return true;
		}

		if (iconName === element[1].name) {
			return true;
		}
	}

	return false;
}
