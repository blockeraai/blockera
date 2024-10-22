/**
 * Internal dependencies
 */
import { getNextMajorVersion } from '../version';

describe('getNextMajorVersion', () => {
	it('increases the minor number by default', () => {
		const result = getNextMajorVersion('1.8.6-rc.1');

		expect(result).toBe('1.9.0');
	});

	it('follow the WordPress versioning scheme', () => {
		const result = getNextMajorVersion('0.9.2');

		expect(result).toBe('1.0.0');
	});
});
