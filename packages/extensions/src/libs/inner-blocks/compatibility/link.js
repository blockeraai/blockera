// @flow

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';
import {
	getColorValueAddonFromVarString,
	isValid,
} from '@publisher/hooks/src/use-value-addon/helpers';

export const linkInnerBlockSupportedBlocks = ['core/paragraph'];

export function linkNormalFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	//
	// Normal color
	//
	if (attributes?.style?.elements?.link?.color?.text) {
		const color = getColorValueAddonFromVarString(
			attributes?.style?.elements?.link?.color?.text
		);

		if (color) {
			return {
				publisherInnerBlocks: {
					link: {
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

export function linkHoverFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	//
	// Hover color
	//
	if (attributes?.style?.elements?.link[':hover']?.color?.text) {
		const color = getColorValueAddonFromVarString(
			attributes?.style?.elements?.link[':hover']?.color?.text
		);

		if (color) {
			return {
				publisherInnerBlocks: {
					link: {
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

export function linkNormalToWPCompatibility({
	newValue,
	ref,
}: {
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
					link: {
						color: undefined,
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
					link: {
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
				link: {
					color: {
						text: newValue,
					},
				},
			},
		},
	};
}

export function linkHoverToWPCompatibility({
	newValue,
	ref,
}: {
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
					link: {
						':hover': {
							color: undefined,
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
					link: {
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
				link: {
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
