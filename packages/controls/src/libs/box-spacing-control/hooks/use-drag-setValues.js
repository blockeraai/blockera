import { extractNumberAndUnit } from '../../input-control/utils';

export const useDragSetValues = ({ value, setValue }) => {
	const setDragValue = (mode, property, newValue) => {
		let extracted = {};
		switch (property) {
			case 'all':
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
					[mode]: {
						...value[mode],
						top: `${newValue}${extracted.unit}`,
						right: `${newValue}${extracted.unit}`,
						bottom: `${newValue}${extracted.unit}`,
						left: `${newValue}${extracted.unit}`,
					},
				});
				break;

			case 'vertical':
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
					[mode]: {
						...value[mode],
						top: `${newValue}${extracted.unit}`,
						bottom: `${newValue}${extracted.unit}`,
					},
				});
				break;

			case 'horizontal':
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
					[mode]: {
						...value[mode],
						right: `${newValue}${extracted.unit}`,
						left: `${newValue}${extracted.unit}`,
					},
				});
				break;

			default:
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
					[mode]: {
						...value[mode],
						[property]: `${newValue}${extracted.unit}`,
					},
				});
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
