import { extractNumberAndUnit } from '../../input-control/utils';

export const useDragSetValues = ({ value, setValue }) => {
	const setDragValue = (mode, property, newValue) => {
		const extracted = extractNumberAndUnit(value[mode][property]);

		if (extracted.unit === 'auto' || extracted.unit === '') {
			extracted.unit = 'px';
		}

		setValue({
			...value,
			[mode]: {
				...value[mode],
				[property]: `${newValue}${extracted.unit}`,
			},
		});
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

		// padding set values
		topPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'top', newValue),
		leftPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'left', newValue),
		rightPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'right', newValue),
		bottomPaddingDragSetValue: (newValue) =>
			setDragValue('padding', 'bottom', newValue),
	};
};
