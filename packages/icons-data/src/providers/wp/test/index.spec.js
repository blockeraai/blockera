/**
 * External dependencies
 */
import {
	chevronUp,
	chevronLeft,
	chevronDown,
	chevronRight,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import getIcon from '../index';

describe('GetIconOfFontAwesomeRegularLibrary', () => {
	test('checking getIcon module to return correct icon of far dataset!', () => {
		expect(getIcon('chevronUp')).toEqual(chevronUp);
		expect(getIcon('chevronLeft')).toEqual(chevronLeft);
		expect(getIcon('chevronDown')).toEqual(chevronDown);
		expect(getIcon('chevronRight')).toEqual(chevronRight);
	});
});
