import { getTargets } from '../helpers';

describe('getTargets api testing', () => {
	it('should be retrieve targets object for wp version greater equal with 6.6.1', () => {
		const result = getTargets('6.6.1');
		expect(result).toHaveProperty('globalStylesPanel');
		expect(result).not.toHaveProperty('header');
	});

	it('should be retrieve targets object for wp 6.6.3-alpha-59007 version', () => {
		const result = getTargets('6.6.3-alpha-59007');
		expect(result).toHaveProperty('globalStylesPanel');
		expect(result).not.toHaveProperty('header');
	});

	it('should be retrieve targets object for wp 6.7.3-beta-12345 version', () => {
		const result = getTargets('6.7.3-beta-12345');
		expect(result).toHaveProperty('globalStylesPanel');
		expect(result).not.toHaveProperty('header');
	});

	it('should be retrieve targets object for wp 6.6 version', () => {
		const result = getTargets('6.6');
		expect(result).toHaveProperty('globalStylesPanel');
		expect(result).not.toHaveProperty('header');
	});
});
