// @flow

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';
import { isValid } from '@publisher/hooks/src/use-value-addon/helpers';
import { getColorVAFromVarString } from '@publisher/core-data';

export function elementNormalFontColorFromWPCompatibility({
	element,
	attributes,
}: {
	element: string,
	attributes: Object,
}): Object {
	if (attributes.style.elements[element]?.color?.text) {
		const color = getColorVAFromVarString(
			attributes.style.elements[element].color.text
		);

		if (color) {
			return {
				publisherInnerBlocks: {
					[element]: {
						attributes: {
							publisherFontColor: color,
						},
					},
				},
			};
		}
	}

	return false;
}

export function elementHoverFontColorFromWPCompatibility({
	element,
	attributes,
}: {
	element: string,
	attributes: Object,
}): Object {
	if (attributes.style.elements[element][':hover']?.color?.text) {
		const color = getColorVAFromVarString(
			attributes.style.elements[element][':hover'].color.text
		);

		if (color) {
			return {
				publisherInnerBlocks: {
					[element]: {
						attributes: {
							publisherBlockStates: {
								normal: {
									breakpoints: { laptop: {} },
									isVisible: true,
								},
								hover: {
									isVisible: true,
									breakpoints: {
										laptop: {
											attributes: {
												publisherFontColor: color,
											},
										},
									},
								},
							},
						},
					},
				},
			};
		}
	}

	return false;
}

export function elementNormalFontColorToWPCompatibility({
	element,
	newValue,
	ref,
}: {
	element: string,
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		return {
			style: {
				elements: {
					[element]: {
						color: {
							text: undefined,
						},
					},
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			style: {
				elements: {
					[element]: {
						color: {
							text: 'var:preset|color|' + newValue?.settings?.id,
						},
					},
				},
			},
		};
	}

	return {
		style: {
			elements: {
				[element]: {
					color: {
						text: newValue,
					},
				},
			},
		},
	};
}

export function elementHoverFontColorToWPCompatibility({
	element,
	newValue,
	ref,
}: {
	element: string,
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		return {
			style: {
				elements: {
					[element]: {
						':hover': {
							color: {
								text: undefined,
							},
						},
					},
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			style: {
				elements: {
					[element]: {
						':hover': {
							color: {
								text:
									'var:preset|color|' +
									newValue?.settings?.id,
							},
						},
					},
				},
			},
		};
	}

	return {
		style: {
			elements: {
				[element]: {
					':hover': {
						color: {
							text: newValue,
						},
					},
				},
			},
		},
	};
}
