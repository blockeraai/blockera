import { getUrlParams } from '../index';

describe('getUrlParams', () => {
	// Store the original window.location
	const originalLocation = window.location;

	beforeEach(() => {
		// Mock window.location
		delete window.location;
		window.location = {
			...originalLocation,
			search: '',
		};
	});

	afterEach(() => {
		// Restore original window.location
		window.location = originalLocation;
	});

	it('should return the correct param value when param exists', () => {
		window.location.search = '?test=value';
		expect(getUrlParams('test')).toBe('value');
	});

	it('should return undefined when param does not exist', () => {
		window.location.search = '?other=value';
		expect(getUrlParams('test')).toBeUndefined();
	});

	it('should handle multiple params correctly', () => {
		window.location.search = '?first=1&second=2&third=3';
		expect(getUrlParams('second')).toBe('2');
	});

	it('should handle empty param values', () => {
		window.location.search = '?empty=';
		expect(getUrlParams('empty')).toBe('');
	});

	it('should handle special characters in param values', () => {
		window.location.search = '?special=%20%26%3D'; // encoded "& ="
		expect(getUrlParams('special')).toBe(' &=');
	});

	it('should handle params with same name (return last value)', () => {
		window.location.search = '?duplicate=first&duplicate=second';
		expect(getUrlParams('duplicate')).toBe('second');
	});

	it('should return undefined for empty search string', () => {
		window.location.search = '';
		expect(getUrlParams('test')).toBeUndefined();
	});
});
