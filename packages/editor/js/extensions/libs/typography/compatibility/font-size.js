// @flow

/**
 * Blockera dependencies
 */
import { getFontSizeBy, generateVariableString } from '@blockera/data';
import { isValid } from '@blockera/editor/js/hooks/use-value-addon/helpers';

export function fontSizeFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.blockeraFontSize === '') {
		// fontSize attribute in root always is variable
		// medium → var(--wp--preset--font-size--medium)
		// it should be changed to a Value Addon (variable)
		if (attributes?.fontSize !== undefined) {
			const fontSizeVar = getFontSizeBy('id', attributes?.fontSize);

			if (fontSizeVar) {
				return {
					blockeraFontSize: {
						settings: {
							...fontSizeVar,
							type: 'font-size',
							var: generateVariableString({
								reference: fontSizeVar?.reference || {
									type: '',
								},
								type: 'font-size',
								id: fontSizeVar?.id || '',
							}),
						},
						name: fontSizeVar?.name,
						isValueAddon: true,
						valueType: 'variable',
					},
				};
			}
		}

		// font size is not variable
		if (attributes?.style?.typography?.fontSize !== undefined) {
			return {
				blockeraFontSize: attributes?.style?.typography?.fontSize,
			};
		}
	}

	return false;
}

export function fontSizeToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return {
			fontSize: undefined,
			style: {
				typography: {
					fontSize: undefined,
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			fontSize: newValue?.settings?.id,
			style: {
				typography: {
					fontSize: undefined,
				},
			},
		};
	}

	return {
		fontSize: undefined,
		style: {
			typography: {
				fontSize: newValue,
			},
		},
	};
}
