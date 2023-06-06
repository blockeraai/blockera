export function convertAlignmentMatrixCoordinates(value) {
	const coordinates = {
		calculated: false,
		compact: '',
		top: {
			number: '',
			text: '',
		},
		left: {
			number: '',
			text: '',
		},
	};

	function convertLocationToCoordinate(location) {
		switch (location) {
			case 'center':
				return {
					number: '50%',
					text: 'center',
				};
				break;

			case 'top':
				return {
					number: '0%',
					text: 'top',
				};
				break;

			case 'bottom':
				return {
					number: '100%',
					text: 'bottom',
				};
				break;

			case 'left':
				return {
					number: '0%',
					text: 'left',
				};
				break;

			case 'right':
				return {
					number: '100%',
					text: 'right',
				};
				break;

			default:
				return {
					number: '50%',
					text: 'center',
				};
				break;
		}
	}

	if (typeof value === 'string') {
		// support for shorthand
		switch (value) {
			case 'center':
				value = 'center center';
				break;

			case 'top':
				value = 'top center';
				break;

			case 'bottom':
				value = 'bottom center';
				break;

			case 'left':
				value = 'center left';
				break;

			case 'right':
				value = 'center right';
				break;
		}

		let splitted = value.split(' ');

		if (splitted.length !== 2) {
			return coordinates;
		}

		coordinates.top = convertLocationToCoordinate(splitted[0]);
		coordinates.left = convertLocationToCoordinate(splitted[1]);
		coordinates.compact = `${coordinates.top.text} ${coordinates.left.text}`;
		coordinates.calculated = true;
	} else if (value?.left && value?.top) {
		switch (value.top) {
			case '0%':
				coordinates.top.number = value.top;
				coordinates.top.text = 'top';
				coordinates.calculated = true;
				break;

			case '50%':
				coordinates.top.number = value.top;
				coordinates.top.text = 'center';
				coordinates.calculated = true;
				break;

			case '100%':
				coordinates.top.number = value.top;
				coordinates.top.text = 'bottom';
				coordinates.calculated = true;
				break;
		}

		switch (value.left) {
			case '0%':
				coordinates.left.number = value.left;
				coordinates.left.text = 'left';
				coordinates.calculated = true;
				break;

			case '50%':
				coordinates.left.number = value.left;
				coordinates.left.text = 'center';
				coordinates.calculated = true;
				break;

			case '100%':
				coordinates.left.number = value.left;
				coordinates.left.text = 'right';
				coordinates.calculated = true;
				break;
		}

		if (!coordinates.calculated) {
			return null;
		}

		coordinates.compact = `${coordinates.top.text} ${coordinates.left.text}`;
	}

	return coordinates;
}
