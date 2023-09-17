import { include } from '../index';

describe('Testing Object utilities', function () {
	const attributes = {
		publisherIcon: {},
		publisherIconPosition: '',
		publisherIconGap: '',
		publisherIconSize: '',
		publisherIconColor: '',
		publisherIconLink: {},
	};

	it('should include keys without "publisher" prefix', function () {
		expect(include(attributes, ['publisherIcon'], 'publisher')).toEqual({
			icon: {},
		});
	});
});
