/**
 * External dependencies
 */
import {
	fa0,
	fa1,
	fa2,
	faAdd,
	faAirFreshener,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Internal dependencies
 */
import getIcon from '../index';

describe('GetIconOfFontAwesomeSolidLibrary', () => {
	test('checking getIcon module to return correct icon of fas dataset!', () => {
		expect(getIcon('fa0')).toEqual(fa0);
		expect(getIcon('fa1')).toEqual(fa1);
		expect(getIcon('fa2')).toEqual(fa2);
		expect(getIcon('faAdd')).toEqual(faAdd);
		expect(getIcon('faAirFreshener')).toEqual(faAirFreshener);
	});
});
