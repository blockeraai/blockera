const getValueType = (value, position) => {
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
	for (const unit of units) {
		if (value.position[position].includes(unit)) {
			return unit;
		}
	}

	return 'px';
};

export const useDragSetValues = ({ value, setValue }) => {
	const setDragValue = (property, newValue) => {
		const unit = getValueType(value, property);
		setValue({
			...value,
			position: {
				...value.position,
				[property]: `${newValue}${unit}`,
			},
		});
	};

	return {
		topDragSetValue: (newValue) => setDragValue('top', newValue),
		leftDragSetValue: (newValue) => setDragValue('left', newValue),
		rightDragSetValue: (newValue) => setDragValue('right', newValue),
		bottomDragSetValue: (newValue) => setDragValue('bottom', newValue),
	};
};
