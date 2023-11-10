const getValueType = (mode, value, property) => {
	const units = [
		'auto',
		'px',
		'%',
		'rem',
		'em',
		'ch',
		'dvw',
		'vw',
		'dvh',
		'vh',
	];
	if (value) {
		for (const unit of units) {
			if (value[mode][property].includes(unit)) {
				return unit;
			}
		}
	}

	return 'px';
};

export const useDragSetValues = ({ value, setValue }) => {
	const setDragValue = (mode, property, newValue) => {
		const unit = getValueType(mode, value, property);
		setValue({
			...value,
			[mode]: {
				...value[mode],
				[property]: `${newValue}${unit}`,
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
