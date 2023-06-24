export function prepare(query: string, dataset: Object): Array<string> {
	const parsedQuery = query.split('.');
	const itemValue = (...values) => values.reduce(accumulator, dataset);

	let props = [];

	parsedQuery.forEach((item, index) => {
		props = toArray(item, index, props);
	});

	return itemValue(...props);
}

export function accumulator(a, x) {
	const regexp = /\[.*]/gi;
	let tempValue = a[x];
	let m;

	while ((m = regexp.exec(x)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regexp.lastIndex) {
			regexp.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.forEach((match) => {
			match[0] = match[0].replace(/[\[\]]/g, '');

			tempValue = tempValue[match[0]];
		});
	}

	return tempValue;
}

export function toArray(item, index, arr) {
	if (-1 !== item.indexOf('[')) {
		const details = item.split('[');

		details.forEach((_item) => {
			arr.push(_item.replace(/[\[\]]/g, ''));
		});

		return arr;
	}

	arr.push(item.replace(/[\[\]]/g, ''));

	return arr;
}
