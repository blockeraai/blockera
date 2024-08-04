// @flow
/**
 * Blockera dependencies
 */
import { isObject, isString } from '@blockera/utils';
import type { Location, Coordinates } from './types/index';
export function convertAlignmentMatrixCoordinates(
	value: { top: string, left: string } | string
): Coordinates {
	const coordinates: Coordinates = {
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

	function convertLocationToCoordinate(location: Location) {
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
		// TODO delete comment below when adding type to utils.
		// $FlowFixMe;
		const split: Location[] = value.split(' ');

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

		// only 1 side detected (other changed)
		if (
			(coordinates.left.text === '' && coordinates.top.text !== '') ||
			(coordinates.left.text !== '' && coordinates.top.text === '')
		) {
			return {
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
		}

		coordinates.compact = `${coordinates.top.text} ${coordinates.left.text}`;
	}

	return coordinates;
}
