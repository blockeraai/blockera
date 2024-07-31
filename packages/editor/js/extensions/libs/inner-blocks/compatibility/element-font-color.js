// @flow

/**
 * Blockera dependencies
 */
import { isValid } from '@blockera/controls';
import { isEmpty, isUndefined } from '@blockera/utils';
import { getColorVAFromVarString } from '@blockera/data';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from '../../../../canvas-editor';

export function elementNormalFontColorFromWPCompatibility({
	innerBlock,
	attributes,
	dataCompatibilityElement,
}: {
	innerBlock: string,
	attributes: Object,
	dataCompatibilityElement: string,
}): Object {
	if (attributes.style.elements[dataCompatibilityElement]?.color?.text) {
		const color = getColorVAFromVarString(
			attributes.style.elements[dataCompatibilityElement].color.text
		);

		if (color) {
			return {
				blockeraInnerBlocks: {
					[innerBlock]: {
						attributes: {
							blockeraFontColor: color,
						},
					},
				},
			};
		}
	}

	return false;
}

export function elementHoverFontColorFromWPCompatibility({
	innerBlock,
	attributes,
	dataCompatibilityElement,
}: {
	innerBlock: string,
	attributes: Object,
	dataCompatibilityElement: string,
}): Object {
	if (
		attributes.style.elements[dataCompatibilityElement][':hover']?.color
			?.text
	) {
		const color = getColorVAFromVarString(
			attributes.style.elements[dataCompatibilityElement][':hover'].color
				.text
		);

		if (color) {
			return {
				blockeraInnerBlocks: {
					[innerBlock]: {
						attributes: {
							blockeraBlockStates: {
								hover: {
									isVisible: true,
									breakpoints: {
										// $FlowFixMe
										[getBaseBreakpoint()]: {
											attributes: {
												blockeraFontColor: color,
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
