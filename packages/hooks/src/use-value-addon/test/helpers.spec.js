import {
	canUnlinkVariable,
	generateVariableString,
	getDynamicValueCategory,
	getDynamicValueIcon,
	getValueAddonRealValue,
	getVariableCategory,
	getVariableIcon,
	isValid,
} from '../helpers';
import { __ } from '@wordpress/i18n';

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
				expect(getValueAddonRealValue('var(--is-blockera)func')).toBe(
					'var(--is-blockera)'
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
									id: 'small',
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
									id: 'not-found',
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
									id: 'not-found',
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
									id: 'not-found',
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
									id: 'not-found',
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
									id: 'not-found',
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

	describe('getVariableIcon', () => {
		test('invalid item', () => {
			expect(
				getVariableIcon({ type: 'jon-doe', value: '12px' })
			).not.toBe(<></>);
		});

		test('font size', () => {
			expect(
				getVariableIcon({ type: 'font-size', value: '12px' })
			).not.toBe(<></>);
		});

		test('radial-gradient', () => {
			expect(
				getVariableIcon({ type: 'radial-gradient', value: '12px' })
			).not.toBe(<></>);
			expect(
				getVariableIcon({ type: 'radial-gradient', value: '' })
			).not.toBe(<></>);
		});

		test('linear-gradient', () => {
			expect(
				getVariableIcon({ type: 'linear-gradient', value: '12px' })
			).not.toBe(<></>);
		});

		test('color', () => {
			expect(
				getVariableIcon({ type: 'color', value: '#ffffff' })
			).not.toBe(<></>);
		});

		test('spacing', () => {
			expect(
				getVariableIcon({ type: 'spacing', value: '12px' })
			).not.toBe(<></>);
		});

		test('width-size', () => {
			expect(
				getVariableIcon({ type: 'width-size', value: '1200px' })
			).not.toBe(<></>);
		});
	});

	describe('getVariableCategory', () => {
		test('invalid item', () => {
			expect(getVariableCategory('invalid')).toStrictEqual({
				name: '',
				items: [],
				notFound: true,
			});
		});

		test('font size', () => {
			const category = getVariableCategory('font-size');

			expect(category.name).toBe(
				__('Editor Font Sizes', 'blockera-core')
			);
		});

		test('linear gradients', () => {
			const category = getVariableCategory('linear-gradient');

			expect(category.name).toBe(
				__('Editor Linear Gradients', 'blockera-core')
			);
		});

		test('radial-gradient', () => {
			const category = getVariableCategory('radial-gradient');

			expect(category.name).toBe(
				__('Editor Radial Gradients', 'blockera-core')
			);
		});

		test('width-size', () => {
			const category = getVariableCategory('width-size');

			expect(category.name).toBe(
				__('Width & Height Sizes', 'blockera-core')
			);
		});

		test('spacing', () => {
			const category = getVariableCategory('spacing');

			expect(category.name).toBe(
				__('Editor Spacing Sizes', 'blockera-core')
			);
		});

		test('color', () => {
			const category = getVariableCategory('color');

			expect(category.name).toBe(__('Editor Colors', 'blockera-core'));
		});
	});

	describe('getDynamicValueIcon', () => {
		test('invalid item', () => {
			expect(getDynamicValueIcon('invalid')).toStrictEqual(<></>);
			expect(getDynamicValueIcon(undefined)).toStrictEqual(<></>);
		});

		test('text', () => {
			expect(getDynamicValueIcon('text')).not.toBe(<></>);
		});

		test('link', () => {
			expect(getDynamicValueIcon('link')).not.toBe(<></>);
		});

		test('image', () => {
			expect(getDynamicValueIcon('image')).not.toBe(<></>);
		});

		test('id', () => {
			expect(getDynamicValueIcon('id')).not.toBe(<></>);
		});

		test('date', () => {
			expect(getDynamicValueIcon('date')).not.toBe(<></>);
		});

		test('time', () => {
			expect(getDynamicValueIcon('time')).not.toBe(<></>);
		});

		test('category', () => {
			expect(getDynamicValueIcon('category')).not.toBe(<></>);
		});

		test('tag', () => {
			expect(getDynamicValueIcon('tag')).not.toBe(<></>);
		});

		test('term', () => {
			expect(getDynamicValueIcon('term')).not.toBe(<></>);
		});

		test('shortcode', () => {
			expect(getDynamicValueIcon('shortcode')).not.toBe(<></>);
		});

		test('email', () => {
			expect(getDynamicValueIcon('email')).not.toBe(<></>);
		});

		test('comment', () => {
			expect(getDynamicValueIcon('comment')).not.toBe(<></>);
		});

		test('meta', () => {
			expect(getDynamicValueIcon('meta')).not.toBe(<></>);
		});
	});

	describe('getDynamicValueCategory', () => {
		test('invalid item', () => {
			expect(getDynamicValueCategory('invalid', 'invalid')).toStrictEqual(
				{
					name: '',
					items: [],
					notFound: true,
				}
			);
		});

		test('post', () => {
			const category = getDynamicValueCategory('post', ['all']);

			expect(category.name).toBe(__('Posts and Pages', 'blockera-core'));
		});

		test('featured-image', () => {
			const category = getDynamicValueCategory('featured-image', ['all']);

			expect(category.name).toBe(
				__('Post Featured Image', 'blockera-core')
			);
		});

		test('archive', () => {
			const category = getDynamicValueCategory('archive', ['all']);

			expect(category.name).toBe(__('Archive', 'blockera-core'));
		});

		test('site', () => {
			const category = getDynamicValueCategory('site', ['all']);

			expect(category.name).toBe(__('Site Information', 'blockera-core'));
		});

		test('user', () => {
			const category = getDynamicValueCategory('user', ['all']);

			expect(category.name).toBe(__('User & Authors', 'blockera-core'));
		});

		test('other', () => {
			const category = getDynamicValueCategory('other', ['all']);

			expect(category.name).toBe(__('Utilities', 'blockera-core'));
		});
	});

	describe('generateVariableString', () => {
		test('valid - type core', () => {
			expect(
				generateVariableString({
					reference: {
						type: 'core',
					},
					type: 'color',
					id: 'base-1',
				})
			).toBe('--wp--preset--color--base-1');
		});

		test('valid - type core-pro', () => {
			expect(
				generateVariableString({
					reference: {
						type: 'core-pro',
					},
					type: 'color',
					id: 'base-1',
				})
			).toBe('--wp--preset--color--base-1');
		});

		test('valid - type plugin', () => {
			expect(
				generateVariableString({
					reference: {
						type: 'plugin',
						plugin: 'WooCommerce',
					},
					type: 'color',
					id: 'base-1',
				})
			).toBe('--wp--preset--color--base-1');
		});

		test('valid - type theme', () => {
			expect(
				generateVariableString({
					reference: {
						type: 'theme',
						theme: 'Blockera SE',
					},
					type: 'color',
					id: 'base-1',
				})
			).toBe('--wp--preset--color--base-1');
		});

		test('valid - type custom', () => {
			expect(
				generateVariableString({
					reference: {
						type: 'custom',
					},
					type: 'color',
					id: 'base-1',
				})
			).toBe('--wp--blockera--color--base-1');
		});

		test('contentSize', () => {
			expect(
				generateVariableString({
					reference: {
						type: 'core',
					},
					type: 'width-size',
					id: 'contentSize',
				})
			).toBe('--wp--style--global--content-size');
		});

		test('wideSize', () => {
			expect(
				generateVariableString({
					reference: {
						type: 'core',
					},
					type: 'width-size',
					id: 'wideSize',
				})
			).toBe('--wp--style--global--wide-size');
		});
	});

	describe('canUnlinkVariable', () => {
		test('invalid value', () => {
			expect(canUnlinkVariable('invalid')).toBe(false);
		});

		test('valid value', () => {
			expect(
				canUnlinkVariable({
					settings: {
						name: 'Small',
						id: 'small',
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
			).toBe(true);
		});

		test('empty value but the variable is available', () => {
			expect(
				canUnlinkVariable({
					settings: {
						name: 'Small',
						id: 'small',
						fluid: null,
						reference: { type: 'preset' },
						type: 'font-size',
						var: '--wp--preset--font-size--small',
					},
					id: 'small',
					isValueAddon: true,
					valueType: 'variable',
				})
			).toBe(true);
		});

		test('empty value and variable is not available', () => {
			expect(
				canUnlinkVariable({
					settings: {
						name: 'Small',
						id: 'small-1',
						fluid: null,
						reference: { type: 'preset' },
						type: 'font-size',
						var: '--wp--preset--font-size--small',
					},
					id: 'small-1',
					isValueAddon: true,
					valueType: 'variable',
				})
			).toBe(false);
		});
	});
});
