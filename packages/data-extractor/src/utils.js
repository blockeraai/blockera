export function regexMatch(
	regexp: string,
	subject: string,
	callback: Function
): null {
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
