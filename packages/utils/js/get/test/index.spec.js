import { getUrlParams } from '../index';

describe('getUrlParams', () => {
	// Store the original URL
	const originalUrl = window.location.href;

	beforeEach(() => {
		// Reset to original URL before each test
		window.history.replaceState({}, '', originalUrl);
	});

	afterEach(() => {
		// Restore original URL after each test
		window.history.replaceState({}, '', originalUrl);
	});

	it('should return the correct param value when param exists', () => {
		window.history.replaceState({}, '', 'http://localhost/?test=value');
		expect(getUrlParams('test')).toBe('value');
	});

	it('should return undefined when param does not exist', () => {
		window.history.replaceState({}, '', 'http://localhost/?other=value');
		expect(getUrlParams('test')).toBeUndefined();
	});

	it('should handle multiple params correctly', () => {
		window.history.replaceState(
			{},
			'',
			'http://localhost/?first=1&second=2&third=3'
		);
		expect(getUrlParams('second')).toBe('2');
	});

	it('should handle empty param values', () => {
		window.history.replaceState({}, '', 'http://localhost/?empty=');
		expect(getUrlParams('empty')).toBe('');
	});

	it('should handle special characters in param values', () => {
		window.history.replaceState(
			{},
			'',
			'http://localhost/?special=%20%26%3D'
		); // encoded "& ="
		expect(getUrlParams('special')).toBe(' &=');
	});

	it('should handle params with same name (return last value)', () => {
		window.history.replaceState(
			{},
			'',
			'http://localhost/?duplicate=first&duplicate=second'
		);
		expect(getUrlParams('duplicate')).toBe('second');
	});

	it('should return undefined for empty search string', () => {
		window.history.replaceState({}, '', 'http://localhost/');
		expect(getUrlParams('test')).toBeUndefined();
	});
});
