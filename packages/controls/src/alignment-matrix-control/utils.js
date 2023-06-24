/**
 * Publisher dependencies
 */
import { isString } from '@publisher/utils';

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

			case 'top':
				return {
					number: '0%',
					text: 'top',
				};

			case 'bottom':
				return {
					number: '100%',
					text: 'bottom',
				};

			case 'left':
				return {
					number: '0%',
					text: 'left',
				};

			case 'right':
				return {
					number: '100%',
					text: 'right',
				};

			default:
				return {
					number: '50%',
					text: 'center',
				};
		}
	}

	if (isString(value)) {
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

		const splitted = value.split(' ');

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
