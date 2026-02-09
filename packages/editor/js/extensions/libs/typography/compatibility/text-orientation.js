// @flow

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function textOrientationFromWPCompatibility({
	attributes,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const writingMode = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.typography?.writingMode
		: attributes?.typography?.writingMode;

	if (
		attributes?.blockeraTextOrientation?.value === '' &&
		writingMode !== undefined
	) {
		if (writingMode === 'horizontal-tb') {
			attributes.blockeraTextOrientation = {
				value: 'initial',
			};
		} else if (writingMode === 'vertical-rl') {
			attributes.blockeraTextOrientation = {
				value: 'style-1',
			};
		}
	}

	return attributes;
}

export function textOrientationToWPCompatibility({
	newValue,
	ref,
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						typography: {
							writingMode: undefined,
						},
					},
				}
			: {
					typography: {
						writingMode: undefined,
					},
				};
	}

	let writingModeValue;
	if (newValue === 'style-1') {
		writingModeValue = 'vertical-rl';
	} else if (newValue === 'initial') {
		writingModeValue = 'horizontal-tb';
	} else {
		writingModeValue = undefined;
	}

	if (writingModeValue === undefined) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						typography: {
							writingMode: undefined,
						},
					},
				}
			: {
					typography: {
						writingMode: undefined,
					},
				};
	}

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				style: {
					typography: {
						writingMode: writingModeValue,
					},
				},
			}
		: {
				typography: {
					writingMode: writingModeValue,
				},
			};
}
