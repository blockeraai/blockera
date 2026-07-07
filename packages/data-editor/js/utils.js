// @flow

export function regexMatch(
	regexp: Object,
	subject: string,
	callback: Function
): void {
	let m;

	while ((m = regexp.exec(subject)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regexp.lastIndex) {
			regexp.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.forEach(callback);
	}
}

/**
 * Get the parent normalized id of a control.
 *
 * @param {string} id The id of the control.
 * @return {string} The parent normalized id of the control.
 */
export function getNormalizedControlParentId(id?: string = ''): string {
	const _id = id || '';

	if (!_id) {
		return '';
	}

	return `${_id}.`;
}
