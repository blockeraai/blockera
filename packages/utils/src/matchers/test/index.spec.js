import { truthy } from '../index';

describe('Condition Utility', () => {
	it('should correctly check with expression includes "=" char truthy matcher', () => {
		expect(truthy('type=text', { type: 'text' })).toBeTruthy();
	});
	it('should correctly check with expression includes "$=" chars truthy matcher', () => {
		expect(truthy('type$=text', { type: 'input-text' })).toBeTruthy();
	});
	it('should correctly check with expression includes "^=" chars truthy matcher', () => {
		expect(truthy('type^=input', { type: 'input-text' })).toBeTruthy();
	});
	it('should correctly check with expression includes "*=" chars truthy matcher', () => {
		expect(truthy('type^=input', { type: 'input-text' })).toBeTruthy();
	});
});
