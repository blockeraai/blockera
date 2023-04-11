/**
 * External dependencies
 */
import {
	frame,
	publisher,
	publisherBlue,
} from '../../../../../icon-library/@publisher';

/**
 * Internal dependencies
 */
import getIcon from '../index';

describe('GetIconOfFontAwesomeRegularLibrary', () => {
	test('checking getIcon module to return correct icon of far dataset!', () => {
		expect(getIcon('frame')).toEqual(frame);
		expect(getIcon('publisher')).toEqual(publisher);
		expect(getIcon('publisherBlue')).toEqual(publisherBlue);
	});
});
