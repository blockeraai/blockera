// @flow

export function alignItemsFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFlexLayout?.alignItems !== '' ||
		attributes?.layout?.verticalAlignment === undefined
	) {
		return false;
	}

	// left WP value - right Blockera value
	const values = {
		top: 'flex-start',
		center: 'center',
		bottom: 'flex-end',
		stretch: 'stretch',
	};

	return {
		blockeraFlexLayout: {
			alignItems: values[attributes?.layout?.verticalAlignment] ?? '',
		},
	};
}

export function justifyContentFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFlexLayout?.justifyContent !== '' ||
		attributes?.layout?.justifyContent === undefined
	) {
		return false;
	}

	// left WP value - right Blockera value
	const values = {
		left: 'flex-start',
		center: 'center',
		right: 'flex-end',
		'space-between': 'space-between',
	};

	return {
		blockeraFlexLayout: {
			justifyContent: values[attributes?.layout?.justifyContent] ?? '',
		},
	};
}

export function directionFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.layout?.orientation === undefined) {
		return false;
	}

	// left WP value - right Blockera value
	const values = {
		horizontal: 'row',
		vertical: 'column',
	};

	return {
		blockeraFlexLayout: {
			direction: values[attributes?.layout?.orientation] ?? '',
		},
	};
}

export function flexLayoutToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return {
			layout: {
				orientation: undefined,
				verticalAlignment: undefined,
				justifyContent: undefined,
			},
		};
	}

	// Align items
	// left Blockera value - right WP value
	const alignItemsValues = {
		'flex-start': 'top',
		center: 'center',
		'flex-end': 'bottom',
		stretch: 'stretch',
	};

	// justify content items
	// left Blockera value - right WP value
	const justifyContentValues = {
		'flex-start': 'left',
		center: 'center',
		'flex-end': 'right',
		'space-between': 'space-between',
		'space-around': 'space-around',
	};

	// Direction items
	// left Blockera value - right WP value
	const directionValues = {
		row: 'horizontal',
		column: 'vertical',
	};

	return {
		layout: {
			orientation: directionValues[newValue?.direction] ?? '',
			verticalAlignment: alignItemsValues[newValue?.alignItems] ?? '',
			justifyContent:
				justifyContentValues[newValue?.justifyContent] ?? '',
		},
	};
}
