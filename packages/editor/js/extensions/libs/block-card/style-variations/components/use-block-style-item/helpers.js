// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

export const getCalculatedNewStyle = ({
	action,
	blockStyles,
	currentStyle,
}: {
	styles: Object,
	currentStyle: Object,
	blockStyles: Array<Object>,
	action: 'duplicate' | 'add-new',
}): { name: string, label: string } => {
	// Get existing style names from both variations and blockStyles
	const existingStylesNames = blockStyles.map((style) => style.name);
	const existingStylesLabels = blockStyles.map((style) => style.label);

	// Base label for new style.
	const baseLabel =
		action === 'duplicate' && currentStyle.label
			? currentStyle.label.replace(/\(Copy(\s\d+|)\)$/, '')
			: __('Style', 'blockera');

	// Find first available number by checking existing style names.
	let number = blockStyles.length + 1;

	const existingNumbers = blockStyles
		.map((style) => {
			const match = style.name.match(/^style-(\d+)$/);
			return match ? parseInt(match[1]) : null;
		})
		.filter((num) => num !== null);

	// Find first gap in sequence or use next number.
	while (existingNumbers.includes(number)) {
		number++;
	}

	const baseName =
		'duplicate' === action && currentStyle.name
			? currentStyle.name.replace(/-copy(-?(\d+|))$/, '')
			: `style-${number}`;

	// Initial label attempt.
	let newLabel = baseLabel;
	let newName = baseName;
	let counter = 1;

	// Keep incrementing counter until we find unused name.
	while (true) {
		const testLabel =
			action === 'duplicate'
				? `${baseLabel} (Copy${1 === counter ? '' : ` ${counter - 1}`})`
				: `${baseLabel} ${counter}`;

		const testName =
			'duplicate' === action
				? `${baseName}-copy${1 === counter ? '' : `-${counter - 1}`}`
				: `${baseName}-${counter}`;

		if (
			!existingStylesNames.includes(testName) &&
			!existingStylesLabels.includes(testLabel)
		) {
			newLabel = testLabel;
			newName = testName;
			break;
		}
		counter++;
	}

	return {
		name: newName,
		label: newLabel,
	};
};
