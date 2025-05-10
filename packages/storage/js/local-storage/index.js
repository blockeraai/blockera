// @flow

export const setItem = (key: string, value: any): void => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		/* @debug-ignore */
		console.error('Failed to save in localStorage', error);
	}
};

export const getItem = (key: string): any => {
	try {
		const value = localStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	} catch (error) {
		/* @debug-ignore */
		console.error('Failed to get from localStorage', error);
		return null;
	}
};

export const updateItem = (key: string, updatedValue: any): any => {
	try {
		const currentValue = getItem(key);
		if (currentValue !== null) {
			const newValue = { ...currentValue, ...updatedValue };
			setItem(key, newValue);
			return newValue;
		}
		return null;
	} catch (error) {
		/* @debug-ignore */
		console.error('Failed to update in localStorage', error);
		return null;
	}
};

export const deleteItem = (key: string): void => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		/* @debug-ignore */
		console.error('Failed to delete from localStorage', error);
	}
};

export const freshItem = (cacheKey: string, startsWith: string): void => {
	// Get all localStorage keys.
	const allKeys = Object.keys(localStorage);

	// Find and remove any previous version cache keys.
	allKeys.forEach((key) => {
		if (key.startsWith(startsWith)) {
			// Don't remove current version's cache.
			if (key !== cacheKey) {
				deleteItem(key);
			}
		}
	});
};
