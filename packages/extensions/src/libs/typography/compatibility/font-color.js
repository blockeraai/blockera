// @flow

/**
 * Publisher dependencies
 */
import { getColor } from '@publisher/core-data';
import {
	generateVariableString,
	isValid,
} from '@publisher/hooks/src/use-value-addon/helpers';

export function fontColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.publisherFontColor === '') {
		// textColor attribute in root always is variable
		// it should be changed to a Value Addon (variable)
		if (attributes?.textColor !== undefined) {
			const fontColorVar = getColor(attributes?.textColor);

			if (fontColorVar) {
				attributes.publisherFontColor = {
					settings: {
						...fontColorVar,
						type: 'color',
						var: generateVariableString({
							reference: fontColorVar?.reference || { type: '' },
							type: 'color',
							id: fontColorVar?.id || '',
						}),
					},
					name: fontColorVar?.name,
					isValueAddon: true,
					valueType: 'variable',
				};
			}
		}
		// font size is not variable
		else if (attributes?.style?.color?.text !== undefined) {
			attributes.publisherFontColor = attributes?.style?.color?.text;
		}
	}

	return attributes;
}

export function fontColorToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action) {
		return {
			textColor: undefined,
			style: {
				color: {
					text: undefined,
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			textColor: newValue?.settings?.id,
		};
	}

	return {
		style: {
			color: {
				text: newValue,
			},
		},
	};
}
