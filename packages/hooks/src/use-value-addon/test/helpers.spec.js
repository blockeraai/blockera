import { getValueAddonRealValue, isValid } from '../helpers';

describe('Helper Functions', () => {
	describe('getValueAddonRealValue', () => {
		describe('Simple Values', () => {
			test('undefined', () => {
				expect(getValueAddonRealValue()).toBe(undefined);
			});

			test('empty', () => {
				expect(getValueAddonRealValue('')).toBe('');
			});

			test('number', () => {
				expect(getValueAddonRealValue(10)).toBe(10);
			});

			test('number as text', () => {
				expect(getValueAddonRealValue('10')).toBe('10');
			});
		});

		describe('CSS Unit Values', () => {
			test('css unit values', () => {
				expect(getValueAddonRealValue('10px')).toBe('10px');
				expect(getValueAddonRealValue('10em')).toBe('10em');
				expect(getValueAddonRealValue('10rem')).toBe('10rem');
				expect(getValueAddonRealValue('10%')).toBe('10%');
			});

			test('css func unit values', () => {
				expect(getValueAddonRealValue('calc(12px)func')).toBe(
					'calc(12px)'
				);
				expect(getValueAddonRealValue('var(--is-publisher)func')).toBe(
					'var(--is-publisher)'
				);
				expect(getValueAddonRealValue('func')).toBe('');
			});
		});

		describe('Value Addon', () => {
			describe('Variables', () => {
				describe('Invalid Objects', () => {
					test('empty object', () => {
						expect(getValueAddonRealValue({})).toBe('');
					});

					test('object that is not value addon', () => {
						expect(getValueAddonRealValue({ test: 'yes' })).toBe(
							''
						);
					});
				});

				describe('Variables', () => {
					test('font size - valid variable - it should return var because the variable is valid', () => {
						expect(
							getValueAddonRealValue({
								settings: {
									name: 'Small',
									slug: 'small',
									value: '13px',
									fluid: null,
									reference: { type: 'preset' },
									type: 'font-size',
									var: '--wp--preset--font-size--small',
								},
								id: 'small',
								isValueAddon: true,
								valueType: 'variable',
							})
						).toBe('var(--wp--preset--font-size--small)');
					});

					test('font size - not valid variable - it should return value because the variable is not valid', () => {
						expect(
							getValueAddonRealValue({
								settings: {
									name: 'Small',
									slug: 'not-found',
									value: '13px',
									fluid: null,
									reference: { type: 'preset' },
									type: 'font-size',
									var: '--wp--preset--font-size--small',
								},
								id: 'not-found',
								isValueAddon: true,
								valueType: 'variable',
							})
						).toBe('13px');
					});

					test('font size - not valid variable & empty value - it should return var for fallback', () => {
						expect(
							getValueAddonRealValue({
								settings: {
									name: 'Small',
									slug: 'not-found',
									value: '',
									fluid: null,
									reference: { type: 'preset' },
									type: 'font-size',
									var: '--wp--preset--font-size--small',
								},
								id: 'not-found',
								isValueAddon: true,
								valueType: 'variable',
							})
						).toBe('var(--wp--preset--font-size--small)');
					});

					test('font size - not valid variable & undefined value - it should return var for fallback', () => {
						expect(
							getValueAddonRealValue({
								settings: {
									name: 'Small',
									slug: 'not-found',
									fluid: null,
									reference: { type: 'preset' },
									type: 'font-size',
									var: '--wp--preset--font-size--small',
								},
								id: 'not-found',
								isValueAddon: true,
								valueType: 'variable',
							})
						).toBe('var(--wp--preset--font-size--small)');
					});

					test('font size - not valid variable & undefined value & empty var - it should return empty', () => {
						expect(
							getValueAddonRealValue({
								settings: {
									name: 'Small',
									slug: 'not-found',
									fluid: null,
									reference: { type: 'preset' },
									type: 'font-size',
									var: '',
								},
								id: 'not-found',
								isValueAddon: true,
								valueType: 'variable',
							})
						).toBe('');
					});

					test('font size - not valid variable & undefined value & undefined var - it should return empty', () => {
						expect(
							getValueAddonRealValue({
								settings: {
									name: 'Small',
									slug: 'not-found',
									fluid: null,
									reference: { type: 'preset' },
									type: 'font-size',
								},
								id: 'not-found',
								isValueAddon: true,
								valueType: 'variable',
							})
						).toBe('');
					});
				});
			});
		});
	});

	describe('isValid', () => {
		test('empty', () => {
			expect(isValid('')).toBe(false);
		});

		test('undefined', () => {
			expect(isValid(undefined)).toBe(false);
		});

		test('invalid object', () => {
			expect(isValid({ test: 'yes' })).toBe(false);
		});

		test('valid object - but not valid value addon', () => {
			expect(isValid({ isValueAddon: false })).toBe(false);
		});

		test('valid object - valid value addon', () => {
			expect(isValid({ isValueAddon: true })).toBe(true);
		});
	});
});
