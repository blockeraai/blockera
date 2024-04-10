// @flow

/**
 * Publisher dependencies
 */
import { getColor, generateVariableString } from '@publisher/core-data';
import { isValid } from '@publisher/hooks/src/use-value-addon/helpers';

export function backgroundColorFromWPCompatibility({
	attributes,
	blockAttributes,
}: {
	attributes: Object,
	blockAttributes: Object,
}): Object {
	if (
		attributes?.publisherBackgroundColor !==
		blockAttributes.publisherBackgroundColor.default
	) {
		return attributes;
	}

	// backgroundColor attribute in root always is variable
	// it should be changed to a Value Addon (variable)
	if (attributes?.backgroundColor !== undefined) {
		const colorVar = getColor(attributes?.backgroundColor);

		if (colorVar) {
			attributes.publisherBackgroundColor = {
				settings: {
					...colorVar,
					type: 'color',
					var: generateVariableString({
						reference: colorVar?.reference || { type: '' },
						type: 'color',
						id: colorVar?.id || '',
					}),
				},
				name: colorVar?.name,
				isValueAddon: true,
				valueType: 'variable',
			};
		}
	}
	// style.color.background is not variable
	else if (attributes?.style?.color?.background !== undefined) {
		attributes.publisherBackgroundColor =
			attributes?.style?.color?.background;
	}

	return attributes;
}

export function backgroundColorToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return {
			backgroundColor: undefined,
			style: {
				color: {
					background: undefined,
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			backgroundColor: newValue?.settings?.id,
			style: {
				color: {
					background: undefined,
				},
			},
		};
	}

	return {
		backgroundColor: undefined,
		style: {
			color: {
				background: newValue,
			},
		},
	};
}
