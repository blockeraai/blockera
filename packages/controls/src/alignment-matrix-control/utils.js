/**
 * Publisher dependencies
 */
import { isObject, isString } from '@publisher/utils';

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

		const split = value.split(' ');

		if (split.length !== 2) {
			return coordinates;
		}

		coordinates.top = convertLocationToCoordinate(split[0]);
		coordinates.left = convertLocationToCoordinate(split[1]);
		coordinates.compact = `${coordinates.top.text} ${coordinates.left.text}`;
		coordinates.calculated = true;
	} else if (isObject(value) && value?.left && value?.top) {
		switch (value.top) {
			case '0':
			case '0%':
				coordinates.top.number = '0%';
				coordinates.top.text = 'top';
				coordinates.calculated = true;
				break;

			case '50':
			case '50%':
				coordinates.top.number = '50%';
				coordinates.top.text = 'center';
				coordinates.calculated = true;
				break;

			case '100':
			case '100%':
				coordinates.top.number = '100%';
				coordinates.top.text = 'bottom';
				coordinates.calculated = true;
				break;
		}

		switch (value.left) {
			case '0':
			case '0%':
				coordinates.left.number = '0%';
				coordinates.left.text = 'left';
				coordinates.calculated = true;
				break;

			case '50':
			case '50%':
				coordinates.left.number = '50%';
				coordinates.left.text = 'center';
				coordinates.calculated = true;
				break;

			case '100':
			case '100%':
				coordinates.left.number = '100%';
				coordinates.left.text = 'right';
				coordinates.calculated = true;
				break;
		}

		if (!coordinates.calculated) {
			return coordinates;
		}

		if (coordinates.left.text === '' && coordinates.top.text !== '') {
			coordinates.left.text = 'center';
			coordinates.left.number = '50%';
		} else if (
			coordinates.left.text !== '' &&
			coordinates.top.text === ''
		) {
			coordinates.top.text = 'center';
			coordinates.top.number = '50%';
		}

		coordinates.compact = `${coordinates.top.text} ${coordinates.left.text}`;
	}

	return coordinates;
}
