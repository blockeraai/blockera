import {
	isArray,
	isBoolean,
	isEmpty,
	isEndWith,
	isFunction,
	isIncludes,
	isJSON,
	isNull,
	isNumber,
	isObject,
	isStartWith,
	isString,
	isUndefined,
	isLocalhost,
} from '../index';

describe('is* testing', () => {
	describe('isUndefined testing...', () => {
		test('is undefined', () => {
			expect(isUndefined(undefined)).toBe(true);
		});

		test('is not undefined', () => {
			expect(isUndefined('text')).toBe(false);
		});
	});

	describe('isEmpty testing...', () => {
		test('is empty', () => {
			expect(isEmpty('')).toBe(true);
		});

		test('is not empty', () => {
			expect(isEmpty('text')).toBe(false);
		});

		test('false is not string', () => {
			expect(isEmpty(false)).toBe(false);
		});

		test('empty object', () => {
			expect(isEmpty({})).toBe(true);
		});

		test('empty array', () => {
			expect(isEmpty([])).toBe(true);
		});
	});

	describe('isNull testing...', () => {
		test('null passed', () => {
			expect(isNull(null)).toBe(true);
		});

		test('undefined passed', () => {
			expect(isNull(undefined)).toBe(false);
		});

		test('undefined passed', () => {
			expect(isNull('null')).toBe(false);
		});
	});

	describe('isNumber testing...', () => {
		test('valid string passed', () => {
			expect(isNumber('12')).toBe(true);
		});

		test('string passed', () => {
			expect(isNumber('12px')).toBe(false);
		});

		test('number passed', () => {
			expect(isNumber(12)).toBe(true);
		});
	});

	describe('isArray testing...', () => {
		test('array passed', () => {
			expect(isArray([])).toBe(true);
		});

		test('object passed', () => {
			expect(isArray({})).toBe(false);
		});

		test('boolean passed', () => {
			expect(isArray(false)).toBe(false);
		});
	});

	describe('isBoolean testing...', () => {
		test('false passed', () => {
			expect(isBoolean(false)).toBe(true);
		});

		test('true passed', () => {
			expect(isBoolean(true)).toBe(true);
		});

		test('undefined passed', () => {
			expect(isBoolean(undefined)).toBe(false);
		});

		test('Boolean passed', () => {
			expect(isBoolean(Boolean)).toBe(false);
		});
	});

	describe('isFunction testing...', () => {
		test('function passed', () => {
			expect(isFunction(() => {})).toBe(true);
		});

		test('true passed', () => {
			expect(isFunction(true)).toBe(false);
		});

		test('undefined passed', () => {
			expect(isFunction(undefined)).toBe(false);
		});
	});

	describe('isJSON testing...', () => {
		test('json passed', () => {
			expect(isJSON({ name: 'akbar' })).toBe(true);
		});

		test('json as string passed', () => {
			expect(isJSON("{name:'akbar'}")).toBe(false);
		});
	});

	describe('isObject testing...', () => {
		test('object passed', () => {
			expect(isObject({ name: 'akbar' })).toBe(true);
		});

		test('array passed', () => {
			expect(isObject(['akbar', 'akbari'])).toBe(false);
		});

		test('function passed', () => {
			expect(isObject(() => {})).toBe(false);
		});

		test('null passed', () => {
			expect(isObject(null)).toBe(false);
		});
	});

	describe('isString testing...', () => {
		test('string passed', () => {
			expect(isString('akbar')).toBe(true);
		});

		test('array passed', () => {
			expect(isString(['akbar', 'akbari'])).toBe(false);
		});

		test('null passed', () => {
			expect(isString(null)).toBe(false);
		});

		test('undefined passed', () => {
			expect(isString(undefined)).toBe(false);
		});
	});

	describe('isEndWith testing...', () => {
		test('ends', () => {
			expect(isEndWith('akbar', 'bar')).toBe(true);
		});

		test('not ends', () => {
			expect(isEndWith('akbar', 'baar')).toBe(false);
		});

		test('target not passed', () => {
			expect(isEndWith('akbar')).toBe(false);
		});

		test('string param is not string!', () => {
			expect(isEndWith(false, 'akbar')).toBe(false);
		});
	});

	describe('isStartWith testing...', () => {
		test('starts', () => {
			expect(isStartWith('akbar', 'ak')).toBe(true);
		});

		test('not starts', () => {
			expect(isStartWith('akbar', 'ab')).toBe(false);
		});

		test('target not passed', () => {
			expect(isStartWith('akbar')).toBe(false);
		});

		test('string param is not string!', () => {
			expect(isStartWith(false, 'akbar')).toBe(false);
		});
	});

	describe('isIncludes testing...', () => {
		test('includes', () => {
			expect(isIncludes('akbar', 'kba')).toBe(true);
		});

		test('not includes', () => {
			expect(isIncludes('akbar', 'hba')).toBe(false);
		});

		test('target not passed', () => {
			expect(isIncludes('akbar')).toBe(false);
		});

		test('string param is not string!', () => {
			expect(isIncludes(false, 'akbar')).toBe(false);
		});
	});

	describe('isLocalhost', () => {
		// Valid localhost cases
		test.each([
			['localhost'],
			['LOCALHOST'],
			['127.0.0.1'],
			['::1'],
			['0.0.0.0'],
			['test.localhost'],
			['dev.localhost'],
			['my-app.local'],
			['127.0.0.2'],
			['127.100.200.1'],
			['192.168.0.1'],
			['192.168.255.255'],
			['10.0.0.1'],
			['10.255.255.255'],
			['172.16.0.1'],
			['172.31.255.255'],
		])('should return true for valid localhost domain: %s', (domain) => {
			expect(isLocalhost(domain)).toBe(true);
		});

		// Full URL cases
		test.each([
			['http://localhost'],
			['https://localhost'],
			['http://localhost:3000'],
			['https://localhost:8080'],
			['http://test.localhost:3000'],
			['http://127.0.0.1:8080'],
			['https://dev.local/path'],
			['http://192.168.1.1:3000/api'],
		])('should return true for valid localhost URL: %s', (url) => {
			expect(isLocalhost(url)).toBe(true);
		});

		// Invalid/Non-localhost cases
		test.each([
			['example.com'],
			['test.com'],
			['192.169.1.1'], // Invalid private IP
			['256.256.256.256'], // Invalid IP
			['172.32.0.1'], // Outside private IP range
			['172.15.0.1'], // Outside private IP range
			['11.0.0.1'], // Public IP
			['foo.bar'],
			['my-site.dev'],
			['localhost.com'], // Public domain containing localhost
			['test.localhost.com'],
		])('should return false for non-localhost domain: %s', (domain) => {
			expect(isLocalhost(domain)).toBe(false);
		});

		// Edge cases and invalid inputs
		test.each([
			[''], // Empty string
			[' '], // Space
			['undefined'], // String undefined
			['null'], // String null
			[null], // null
			[undefined], // undefined
			[{}], // Empty object
			[[]], // Empty array
			[123], // Number
			[true], // Boolean
		])('should return false for invalid input: %s', (input) => {
			expect(isLocalhost(input)).toBe(false);
		});

		// Malformed URL cases
		test.each([
			['http:/localhost'],
			['https://localhost:abc'],
			['ftp:/127.0.0.1'],
			['http:localhost'],
		])('should handle malformed URLs gracefully: %s', (url) => {
			expect(() => isLocalhost(url)).not.toThrow();
		});
	});
});
