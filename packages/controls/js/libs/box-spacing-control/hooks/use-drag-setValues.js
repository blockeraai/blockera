// @flow

/**
 *  Dependencies
 */

/**
 * Internal Dependencies
 */
import { isValid } from '../../../';
import { extractNumberAndUnit } from '../../input-control/utils';

type Property =
	| 'top'
	| 'left'
	| 'right'
	| 'bottom'
	| 'vertical'
	| 'horizontal'
	| 'all';

export const useDragSetValues = ({
	value,
	setValue,
}: {
	value: Object,
	setValue: (Object) => void,
}): ({
	topMarginDragSetValue: (value: string | Object) => void,
	leftMarginDragSetValue: (value: string | Object) => void,
	rightMarginDragSetValue: (value: string | Object) => void,
	bottomMarginDragSetValue: (value: string | Object) => void,
	allMarginDragSetValue: (value: string | Object) => void,
	topBottomMarginDragSetValue: (value: string | Object) => void,
	leftRightMarginDragSetValue: (value: string | Object) => void,
	topPaddingDragSetValue: (value: string | Object) => void,
	leftPaddingDragSetValue: (value: string | Object) => void,
	rightPaddingDragSetValue: (value: string | Object) => void,
	bottomPaddingDragSetValue: (value: string | Object) => void,
	allPaddingDragSetValue: (value: string | Object) => void,
	topBottomPaddingDragSetValue: (value: string | Object) => void,
	leftRightPaddingDragSetValue: (value: string | Object) => void,
}) => {
	const setDragValue = (
		mode: 'padding' | 'margin',
		property: Property,
		newValue: string | Object
	): void => {
		let extracted = {};
		switch (property) {
			case 'all':
				if (isValid(newValue)) {
					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							top: newValue,
							right: newValue,
							bottom: newValue,
							left: newValue,
						},
					});
				} else if (newValue === '') {
					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							top: '',
							right: '',
							bottom: '',
							left: '',
						},
					});
				} else {
					extracted = extractNumberAndUnit(value[mode].top);

					if (
						extracted.unit === 'auto' ||
						extracted.unit === '' ||
						extracted.unit === 'func'
					) {
						extracted.unit = 'px';
					}

					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							top: `${newValue}${extracted.unit}`,
							right: `${newValue}${extracted.unit}`,
							bottom: `${newValue}${extracted.unit}`,
							left: `${newValue}${extracted.unit}`,
						},
					});
				}

				break;

			case 'vertical':
				if (isValid(newValue)) {
					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							top: newValue,
							bottom: newValue,
						},
					});
				} else if (newValue === '') {
					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							top: '',
							bottom: '',
						},
					});
				} else {
					extracted = extractNumberAndUnit(value[mode].top);

					if (
						extracted.unit === 'auto' ||
						extracted.unit === '' ||
						extracted.unit === 'func'
					) {
						extracted.unit = 'px';
					}

					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							top: `${newValue}${extracted.unit}`,
							bottom: `${newValue}${extracted.unit}`,
						},
					});
				}

				break;

			case 'horizontal':
				if (isValid(newValue)) {
					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							right: newValue,
							left: newValue,
						},
					});
				} else if (newValue === '') {
					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							right: '',
							left: '',
						},
					});
				} else {
					extracted = extractNumberAndUnit(value[mode].left);

					if (
						extracted.unit === 'auto' ||
						extracted.unit === '' ||
						extracted.unit === 'func'
					) {
						extracted.unit = 'px';
					}

					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							right: `${newValue}${extracted.unit}`,
							left: `${newValue}${extracted.unit}`,
						},
					});
				}

				break;

			default:
				if (isValid(newValue)) {
					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							[(property: string)]: newValue,
						},
					});
				} else if (newValue === '') {
					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							[(property: string)]: '',
						},
					});
				} else {
					extracted = extractNumberAndUnit(value[mode][property]);

					if (
						extracted.unit === 'auto' ||
						extracted.unit === '' ||
						extracted.unit === 'func'
					) {
						extracted.unit = 'px';
					}

					setValue({
						...value,
						[(mode: string)]: {
							...value[mode],
							[(property: string)]: `${newValue}${extracted.unit}`,
						},
					});
				}
		}
	};

	return {
		// margin set values
		topMarginDragSetValue: (newValue) =>
			setDragValue('margin', 'top', newValue),
		leftMarginDragSetValue: (newValue) =>
			setDragValue('margin', 'left', newValue),
		rightMarginDragSetValue: (newValue) =>
			setDragValue('margin', 'right', newValue),
		bottomMarginDragSetValue: (newValue) =>
			setDragValue('margin', 'bottom', newValue),
		allMarginDragSetValue: (newValue) =>
			setDragValue('margin', 'all', newValue),
		topBottomMarginDragSetValue: (newValue) =>
			setDragValue('margin', 'vertical', newValue),
		leftRightMarginDragSetValue: (newValue) =>
			setDragValue('margin', 'horizontal', newValue),

		// padding set values
		topPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'top', newValue),
		leftPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'left', newValue),
		rightPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'right', newValue),
		bottomPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'bottom', newValue),
		allPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'all', newValue),
		topBottomPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'vertical', newValue),
		leftRightPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'horizontal', newValue),
	};
};
