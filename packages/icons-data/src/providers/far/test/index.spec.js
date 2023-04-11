/**
 * External dependencies
 */
import {
	faAngry,
	faAddressCard,
	faArrowAltCircleLeft,
} from '@fortawesome/free-regular-svg-icons';

/**
 * Internal dependencies
 */
import getIcon from '../index';

describe('GetIconOfFontAwesomeRegularLibrary', () => {
	test('checking getIcon module to return correct icon of far dataset!', () => {
		expect(getIcon('faAngry')).toEqual(faAngry);
		expect(getIcon('faAddressCard')).toEqual(faAddressCard);
		expect(getIcon('faArrowAltCircleLeft')).toEqual(faArrowAltCircleLeft);
	});
});
