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
import { runInsideBlockInspector } from '../../../utils';
import { getBaseBreakpoint } from '../../../../../editor/header-ui';

export function elementNormalFontColorFromWPCompatibility({
	innerBlock,
	attributes,
	insideBlockInspector,
	editorSelectedBlockEvent,
	dataCompatibilityElement,
}: {
	innerBlock: string,
	attributes: Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	dataCompatibilityElement: string,
}): Object {
	if (
		attributes?.style?.elements?.[dataCompatibilityElement]?.color?.text ||
		attributes?.elements?.[dataCompatibilityElement]?.color?.text
	) {
		const color = getColorVAFromVarString(
			runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
				? attributes?.style?.elements?.[dataCompatibilityElement]?.color
						?.text
				: attributes?.elements?.[dataCompatibilityElement]?.color?.text
		);

		if (color) {
			return {
				blockeraInnerBlocks: {
					value: {
						[innerBlock]: {
							attributes: {
								blockeraFontColor: color,
							},
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
	insideBlockInspector,
	editorSelectedBlockEvent,
	dataCompatibilityElement,
}: {
	innerBlock: string,
	attributes: Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	dataCompatibilityElement: string,
}): Object {
	if (
		attributes?.style?.elements?.[dataCompatibilityElement]?.[':hover']
			?.color?.text ||
		attributes?.elements?.[dataCompatibilityElement]?.[':hover']?.color
			?.text
	) {
		const color = getColorVAFromVarString(
			runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
				? attributes.style.elements[dataCompatibilityElement][':hover']
						.color.text
				: attributes.elements[dataCompatibilityElement][':hover'].color
						.text
		);

		if (color) {
			return {
				blockeraInnerBlocks: {
					value: {
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
	insideBlockInspector,
	editorSelectedBlockEvent,
}: {
	element: string,
	newValue: Object,
	ref?: Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	const useStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		const elements = {
			elements: {
				[element]: {
					color: {
						text: undefined,
					},
				},
			},
		};

		return {
			...(useStyle
				? {
						style: {
							elements: elements.elements,
						},
					}
				: elements),
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		const elements = {
			elements: {
				[element]: {
					color: {
						text: 'var:preset|color|' + newValue?.settings?.id,
					},
				},
			},
		};

		return {
			...(useStyle
				? {
						style: {
							elements: elements.elements,
						},
					}
				: elements),
		};
	}

	const elements = {
		elements: {
			[element]: {
				color: {
					text: newValue,
				},
			},
		},
	};

	return {
		...(useStyle
			? {
					style: {
						elements: elements.elements,
					},
				}
			: elements),
	};
}

export function elementHoverFontColorToWPCompatibility({
	element,
	newValue,
	ref,
	insideBlockInspector,
	editorSelectedBlockEvent,
}: {
	element: string,
	newValue: Object,
	ref?: Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	const useStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		const elements = {
			elements: {
				[element]: {
					':hover': {
						color: {
							text: undefined,
						},
					},
				},
			},
		};

		return {
			...(useStyle
				? {
						style: {
							elements: elements.elements,
						},
					}
				: elements),
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		const elements = {
			elements: {
				[element]: {
					':hover': {
						color: {
							text: 'var:preset|color|' + newValue?.settings?.id,
						},
					},
				},
			},
		};

		return {
			...(useStyle
				? {
						style: {
							elements: elements.elements,
						},
					}
				: elements),
		};
	}

	const elements = {
		elements: {
			[element]: {
				':hover': {
					color: {
						text: newValue,
					},
				},
			},
		},
	};

	return {
		...(useStyle
			? {
					style: {
						elements: elements.elements,
					},
				}
			: elements),
	};
}
