/**
 * External dependencies
 */
import { renderHook, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useValue } from '../index';

describe('useValue testing', () => {
	test('initialValue not passed', () => {
		const { result } = renderHook(() => useValue({}));

		expect(result.current.value).toBe(undefined);
	});

	test('initialValue passed', () => {
		let upperComponentValue = '';

		const onChange = (newValue) => {
			upperComponentValue = newValue;
		};

		const { result } = renderHook(() =>
			useValue({
				initialValue: 1,
				defaultValue: 0,
				onChange,
			})
		);

		// initial value passed and it should be 1
		expect(result.current.value).toBe(1);
		expect(upperComponentValue).toBe('');

		act(() => {
			result.current.setValue('Akbar');
		});

		expect(result.current.value).toBe('Akbar');
		expect(upperComponentValue).toBe('Akbar');

		// reset value to initialValue
		act(() => {
			result.current.resetToInitial();
		});
		expect(result.current.value).toBe(1);

		// reset value to defaultValue
		act(() => {
			result.current.resetToDefault();
		});
		expect(result.current.value).toBe(0);
	});

	test('initialValue not passed but defaultValue passed', () => {
		const { result } = renderHook(() =>
			useValue({
				defaultValue: 'Akbar',
			})
		);

		// initial value passed and it should be 1
		expect(result.current.value).toBe('Akbar');
	});

	test('merge initialValue and defaultValue but object not passed', () => {
		const { result } = renderHook(() =>
			useValue({
				initialValue: 'Hello',
				defaultValue: 'Akbar',
				mergeInitialAndDefault: true,
			})
		);

		// initial value passed and it should be 1
		expect(result.current.value).toBe('Hello');
	});

	test('merge initialValue and defaultValue', () => {
		const { result } = renderHook(() =>
			useValue({
				initialValue: {
					name: 'Akbar',
				},
				defaultValue: {
					name: 'Hello',
					family: 'Akbari',
				},
				mergeInitialAndDefault: true,
			})
		);

		// initial value passed and it should be 1
		expect(result.current.value).toStrictEqual({
			name: 'Akbar',
			family: 'Akbari',
		});
	});

	test('toggle boolean value', () => {
		const { result } = renderHook(() =>
			useValue({
				initialValue: true,
				defaultValue: false,
			})
		);

		expect(result.current.value).toBe(true);

		act(() => {
			result.current.toggleValue();
		});

		expect(result.current.value).toBe(false);
	});

	test('toggle on not a boolean value', () => {
		const { result } = renderHook(() =>
			useValue({
				initialValue: 'Hello',
				defaultValue: 'Akbar',
			})
		);

		expect(result.current.value).toBe('Hello');

		act(() => {
			result.current.toggleValue();
		});

		expect(result.current.value).toBe('Hello');
	});
});
