// @flow

export function isValueAddonShape(value: mixed): boolean {
	return (
		value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		(value: Object).isValueAddon === true
	);
}

/**
 * Resolves a stored scalar (plain string or value-addon leaf) for CSS declarations.
 * Intentionally lighter than controls `getValueAddonRealValue` — no store lookups.
 */
export function resolveStoredScalarForCssDeclaration(value: mixed): string {
	if (value === undefined || value === '') {
		return '';
	}
	if (typeof value === 'string') {
		return value.trim();
	}
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return '';
	}

	const objectValue = (value: Object);

	if (isValueAddonShape(objectValue)) {
		const settingsValue = objectValue.settings?.value;
		if (typeof settingsValue === 'string' && settingsValue.trim()) {
			return settingsValue.trim();
		}
		const variable = objectValue.settings?.var;
		if (typeof variable === 'string' && variable.trim()) {
			const token = variable.trim();
			return token.startsWith('--') ? `var(${token})` : `var(--${token})`;
		}
		return '';
	}

	if (typeof objectValue.settings?.value === 'string') {
		return String(objectValue.settings.value).trim();
	}

	return '';
}
