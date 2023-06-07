/**
 * WordPress dependencies
 */

// import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
// import { BlockEditContext } from '@publisher/extensions';

export function getControlValue(
	forceValue,
	attribute,
	repeaterAttribute,
	repeaterAttributeIndex,
	defaultValue = '',
	attributes
) {
	// const { attributes } = useContext(BlockEditContext);

	if (typeof forceValue !== 'undefined') {
		return forceValue;
	}

	if (
		repeaterAttribute !== null &&
		repeaterAttributeIndex !== null &&
		typeof attributes[repeaterAttribute][repeaterAttributeIndex][
			attribute
		] !== 'undefined'
	) {
		return attributes[repeaterAttribute][repeaterAttributeIndex][attribute];
	} else if (typeof attributes[attribute] !== 'undefined') {
		return attributes[attribute];
	}

	return defaultValue;
}

export function updateControlValue(
	value,
	attribute,
	repeaterAttribute,
	repeaterAttributeIndex,
	attributes,
	setAttributes
) {
	// const { setAttributes } = useContext(BlockEditContext);

	if (!attribute) {
		return;
	}

	if (repeaterAttribute !== null) {
		setAttributes({
			...attributes,
			[repeaterAttribute]: attributes[repeaterAttribute]?.map(
				(repeaterItem, index) => {
					if (repeaterAttributeIndex !== index) {
						return repeaterItem;
					}

					return {
						...repeaterItem,
						[attribute]: value,
					};
				}
			),
		});
	} else {
		setAttributes({
			...attributes,
			[attribute]: value,
		});
	}
}
