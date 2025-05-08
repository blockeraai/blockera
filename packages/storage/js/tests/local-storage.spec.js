import {
	setItem,
	getItem,
	freshItem,
	deleteItem,
	updateItem,
} from '../local-storage';

describe('localStorageService', () => {
	beforeEach(() => {
		// Mock localStorage
		Storage.prototype.setItem = jest.fn();
		Storage.prototype.getItem = jest.fn();
		Storage.prototype.removeItem = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('setItem', () => {
		it('should store a value in localStorage', () => {
			setItem('testKey', { name: 'John' });
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'testKey',
				JSON.stringify({ name: 'John' })
			);
		});

		it('should handle error if localStorage.setItem fails', () => {
			localStorage.setItem.mockImplementation(() => {
				throw new Error('Storage failure');
			});
			expect(() => setItem('testKey', { name: 'John' })).not.toThrow();
			expect(localStorage.setItem).toHaveBeenCalled();
		});
	});

	describe('getItem', () => {
		it('should retrieve a value from localStorage', () => {
			localStorage.getItem.mockReturnValue(
				JSON.stringify({ name: 'John' })
			);
			const result = getItem('testKey');
			expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
			expect(result).toEqual({ name: 'John' });
		});

		it('should return null if the key does not exist', () => {
			localStorage.getItem.mockReturnValue(null);
			const result = getItem('unknownKey');
			expect(result).toBeNull();
		});

		it('should handle error if localStorage.getItem fails', () => {
			localStorage.getItem.mockImplementation(() => {
				throw new Error('Storage failure');
			});
			expect(() => getItem('testKey')).not.toThrow();
			expect(getItem('testKey')).toBeNull();
		});
	});

	describe('updateItem', () => {
		it('should update a value in localStorage', () => {
			localStorage.getItem.mockReturnValue(
				JSON.stringify({ name: 'John', age: 30 })
			);
			updateItem('testKey', { age: 31 });
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'testKey',
				JSON.stringify({ name: 'John', age: 31 })
			);
		});

		it('should return null if the item does not exist', () => {
			localStorage.getItem.mockReturnValue(null);
			const result = updateItem('unknownKey', { age: 31 });
			expect(result).toBeNull();
		});

		it('should handle error if update fails', () => {
			localStorage.getItem.mockImplementation(() => {
				throw new Error('Storage failure');
			});
			expect(() => updateItem('testKey', { age: 31 })).not.toThrow();
			expect(updateItem('testKey', { age: 31 })).toBeNull();
		});
	});

	describe('deleteItem', () => {
		it('should remove a value from localStorage', () => {
			deleteItem('testKey');
			expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
		});

		it('should handle error if delete fails', () => {
			localStorage.removeItem.mockImplementation(() => {
				throw new Error('Storage failure');
			});
			expect(() => deleteItem('testKey')).not.toThrow();
			expect(localStorage.removeItem).toHaveBeenCalled();
		});
	});

	describe('freshItem', () => {
		it('should remove old cache keys that start with the specified prefix', () => {
			setItem('cache_v1_data', { name: 'John' });
			setItem('cache_v2_data', { name: 'John' });
			setItem('cache_v3_data', { name: 'John' });

			freshItem('cache_v2_data', 'cache_');

			// Should remove cache_v1_data and cache_v3_data but keep cache_v2_data.
			expect(localStorage.getItem('cache_v1_data')).toBeUndefined();
			expect(localStorage.getItem('cache_v3_data')).toBeUndefined();
			expect(localStorage.getItem('cache_v2_data')).not.toBeNull();
		});

		it('should not remove any keys if no matches found', () => {
			setItem('other_key1', { name: 'John' });
			setItem('other_key2', { name: 'John' });

			freshItem('cache_v2_data', 'cache_');

			expect(localStorage.removeItem).not.toHaveBeenCalled();
		});
	});
});
