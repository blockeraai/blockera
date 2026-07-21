import { localStorage, sessionStorage, getStorageKey } from '../local-storage';

describe('scoped browser storage API', () => {
	let store;

	beforeEach(() => {
		store = {};
		const createBackend = () => ({
			getItem: jest.fn((key) =>
				Object.prototype.hasOwnProperty.call(store, key)
					? store[key]
					: null
			),
			setItem: jest.fn((key, value) => {
				store[key] = String(value);
			}),
			removeItem: jest.fn((key) => {
				delete store[key];
			}),
			key: jest.fn((i) => Object.keys(store)[i] ?? null),
			get length() {
				return Object.keys(store).length;
			},
		});

		Object.defineProperty(window, 'localStorage', {
			configurable: true,
			value: createBackend(),
		});
		Object.defineProperty(window, 'sessionStorage', {
			configurable: true,
			value: createBackend(),
		});

		delete window.blockeraStorageSiteKey;
		delete window.blockeraStorageUserId;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getStorageKey', () => {
		it('should scope keys with site key and user id from window', () => {
			window.blockeraStorageSiteKey = 'site-uuid';
			window.blockeraStorageUserId = 7;
			expect(getStorageKey('testKey')).toBe('testKey__site-uuid_u7');
		});

		it('should fall back to 0 site and user when globals are missing', () => {
			expect(getStorageKey('testKey')).toBe('testKey__0_u0');
		});
	});

	describe('localStorage (string API)', () => {
		it('should set and get a string value with a scoped key', () => {
			localStorage.setItem('testKey', 'hello');
			expect(window.localStorage.setItem).toHaveBeenCalledWith(
				'testKey__0_u0',
				'hello'
			);
			expect(localStorage.getItem('testKey')).toBe('hello');
		});

		it('should remove a scoped key', () => {
			localStorage.setItem('testKey', 'hello');
			localStorage.removeItem('testKey');
			expect(window.localStorage.removeItem).toHaveBeenCalledWith(
				'testKey__0_u0'
			);
			expect(localStorage.getItem('testKey')).toBeNull();
		});

		it('should not throw when backend setItem fails', () => {
			window.localStorage.setItem.mockImplementation(() => {
				throw new Error('Storage failure');
			});
			expect(() => localStorage.setItem('testKey', 'x')).not.toThrow();
		});
	});

	describe('localStorage JSON helpers', () => {
		it('should set and get JSON values', () => {
			localStorage.setJSON('testKey', { name: 'John' });
			expect(window.localStorage.setItem).toHaveBeenCalledWith(
				'testKey__0_u0',
				JSON.stringify({ name: 'John' })
			);
			expect(localStorage.getJSON('testKey')).toEqual({ name: 'John' });
		});

		it('should update JSON values', () => {
			localStorage.setJSON('testKey', { name: 'John', age: 30 });
			const result = localStorage.updateJSON('testKey', { age: 31 });
			expect(result).toEqual({ name: 'John', age: 31 });
			expect(localStorage.getJSON('testKey')).toEqual({
				name: 'John',
				age: 31,
			});
		});

		it('should return null from updateJSON when missing', () => {
			expect(localStorage.updateJSON('missing', { a: 1 })).toBeNull();
		});

		it('should remove via removeItem', () => {
			localStorage.setJSON('testKey', { a: 1 });
			localStorage.removeItem('testKey');
			expect(window.localStorage.removeItem).toHaveBeenCalledWith(
				'testKey__0_u0'
			);
		});
	});

	describe('freshItem', () => {
		it('should remove old cache keys for the current site/user only', () => {
			store = {
				cache_v1_data__0_u0: '1',
				cache_v2_data__0_u0: '2',
				cache_v3_data__0_u0: '3',
				cache_v1_data__other_u1: 'other',
			};

			localStorage.freshItem('cache_v2_data', 'cache_');

			expect(window.localStorage.removeItem).toHaveBeenCalledWith(
				'cache_v1_data__0_u0'
			);
			expect(window.localStorage.removeItem).toHaveBeenCalledWith(
				'cache_v3_data__0_u0'
			);
			expect(window.localStorage.removeItem).not.toHaveBeenCalledWith(
				'cache_v2_data__0_u0'
			);
			expect(window.localStorage.removeItem).not.toHaveBeenCalledWith(
				'cache_v1_data__other_u1'
			);
		});
	});

	describe('sessionStorage', () => {
		it('should set and get with scoped keys on sessionStorage', () => {
			sessionStorage.setItem('bulk', '1,2,3');
			expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
				'bulk__0_u0',
				'1,2,3'
			);
			expect(sessionStorage.getItem('bulk')).toBe('1,2,3');
			sessionStorage.removeItem('bulk');
			expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(
				'bulk__0_u0'
			);
		});
	});
});
