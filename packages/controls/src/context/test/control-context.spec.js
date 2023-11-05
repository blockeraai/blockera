/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';
import { renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useControlContext } from '../hooks';
import { ControlContextProvider } from '../index';

function getControlId() {
	return String(Math.random());
}

describe('testing control context provider and related hooks', () => {
	it('should value is null when not wrapped with context and other args not passing', () => {
		const { result } = renderHook(() => useControlContext());

		expect(result.current.value).toBe(null);
	});

	it('arguments includes id', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: {
						x: 20,
					},
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(() => useControlContext({ id: 'x' }), {
			wrapper,
		});

		expect(result.current.value).toBe(20);
	});

	it('should retrieve undefined value when id is invalid and defaultValue is not defined', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: {
						x: [{ y: 20 }],
					},
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() => useControlContext({ id: 'x[1].y' }),
			{
				wrapper,
			}
		);

		expect(result.current.value).toBe(undefined);
	});

	it('should retrieve defaultValue when id is invalid and defaultValue is defined', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: {
						x: 20,
					},
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() => useControlContext({ id: 'y', defaultValue: 10 }),
			{
				wrapper,
			}
		);

		expect(result.current.value).toBe(10);
	});

	it('should retrieve defaultValue when id is valid, value is undefined, and defaultValue is defined', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: {
						x: [
							{
								y: undefined,
							},
						],
					},
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() => useControlContext({ id: 'x[0].y', defaultValue: 10 }),
			{
				wrapper,
			}
		);

		expect(result.current.value).toBe(10);
	});

	it('should retrieve defaultValue when id is invalid, value is undefined, and defaultValue is defined', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: {
						x: [
							{
								y: undefined,
							},
						],
					},
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() => useControlContext({ id: 'x[0].z.y', defaultValue: 10 }),
			{
				wrapper,
			}
		);

		expect(result.current.value).toBe(10);
	});

	it('should retrieve defaultValue when id is invalid, value is not Array, and defaultValue is defined', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: {
						x: [
							{
								y: [{ isVisible: true }],
							},
						],
					},
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() =>
				useControlContext({
					repeater: {
						repeaterId: 'x[0].z.y',
						defaultRepeaterItemValue: { x: 10 },
					},
					defaultValue: [{ isVisible: true }, { isVisible: true }],
					mergeInitialAndDefault: true,
				}),
			{
				wrapper,
			}
		);

		expect(result.current.value).toEqual([
			{ isVisible: true, x: 10 },
			{ isVisible: true, x: 10 },
		]);
	});

	it('should retrieve defaultValue when id is invalid, value is Array, and defaultValue is defined', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: [
						{
							y: [
								{ isVisible: true },
								{ isVisible: true },
								{ isVisible: true },
							],
						},
					],
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() =>
				useControlContext({
					repeater: {
						repeaterId: '[0].z.y',
						defaultRepeaterItemValue: { x: 10 },
					},
					defaultValue: [{ isVisible: true }, { isVisible: true }],
					mergeInitialAndDefault: true,
				}),
			{
				wrapper,
			}
		);

		expect(result.current.value).toEqual([
			{
				y: [
					{ isVisible: true },
					{ isVisible: true },
					{ isVisible: true },
				],
				x: 10,
			},
		]);
	});

	it('should return defaultValue when arguments just includes defaultValue', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: null,
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() => useControlContext({ defaultValue: 56 }),
			{ wrapper }
		);

		expect(result.current.value).toBe(56);
	});

	it('should merged defaultValue and context value when mergeInitialAndDefault flag is true', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: {
						x: 20,
					},
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() =>
				useControlContext({
					defaultValue: { y: 20 },
					mergeInitialAndDefault: true,
				}),
			{
				wrapper,
			}
		);

		expect(result.current.value).toEqual({
			x: 20,
			y: 20,
		});
	});

	it('should return repeater merged value when mergeInitialAndDefault flag is true and use in repeater', () => {
		const defaultRepeaterItemValue = {
			y: 30,
		};
		const storeName = 'publisher-core/controls/repeater';

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: [{ x: 20 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { result } = renderHook(
			() =>
				useControlContext({
					repeater: {
						defaultRepeaterItemValue,
					},
					mergeInitialAndDefault: true,
				}),
			{
				wrapper,
			}
		);

		expect(result.current.value).toEqual([
			{ ...defaultRepeaterItemValue, ...{ x: 20 } },
		]);
	});

	it('should return defaultValue when repeater details is empty object', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: [],
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const { result } = renderHook(
			() =>
				useControlContext({
					repeater: {},
					defaultValue: [],
				}),
			{
				wrapper,
			}
		);

		expect(result.current.value).toEqual([]);
	});

	it('should must be add repeater 1 item', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'publisher-core/controls/repeater';
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: [],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { addRepeaterItem } = dispatch(storeName);

		addRepeaterItem({
			controlId: name,
			value: defaultRepeaterItemValue,
		});

		setTimeout(() => {
			const { result } = renderHook(
				() => {
					return useControlContext({
						repeater: {
							defaultRepeaterItemValue,
						},
						mergeInitialAndDefault: true,
					});
				},
				{
					wrapper,
				}
			);

			expect(result.current.value).toEqual([defaultRepeaterItemValue]);
		}, 1000);
	});

	it('should must be change repeater specific item', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'publisher-core/controls/repeater';
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { changeRepeaterItem } = dispatch(storeName);

		changeRepeaterItem({
			controlId: name,
			repeaterId: '[1]',
			value: { x: 55 },
		});

		setTimeout(() => {
			const { result } = renderHook(
				() => {
					return useControlContext({
						repeater: {
							defaultRepeaterItemValue,
						},
						mergeInitialAndDefault: true,
					});
				},
				{
					wrapper,
				}
			);

			expect(result.current.value).toEqual([{ x: 0 }, { x: 55 }]);
		}, 1000);
	});

	it('should must be remove repeater specific item', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'publisher-core/controls/repeater';
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { removeRepeaterItem } = dispatch(storeName);

		removeRepeaterItem({
			controlId: name,
			repeaterId: '[1]',
		});

		setTimeout(() => {
			const { result } = renderHook(
				() => {
					return useControlContext({
						repeater: {
							defaultRepeaterItemValue,
						},
						mergeInitialAndDefault: true,
					});
				},
				{
					wrapper,
				}
			);

			expect(result.current.value).toEqual([{ x: 0 }]);
		}, 1000);
	});

	it('should must be sort repeater items', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'publisher-core/controls/repeater';
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { removeRepeaterItem } = dispatch(storeName);

		removeRepeaterItem({
			controlId: name,
			repeaterId: '[1]',
			items: [{ x: 10 }, { x: 0 }],
			toIndex: 0,
			fromIndex: 1,
		});

		setTimeout(() => {
			const { result } = renderHook(
				() => {
					return useControlContext({
						repeater: {
							defaultRepeaterItemValue,
						},
						mergeInitialAndDefault: true,
					});
				},
				{
					wrapper,
				}
			);

			expect(result.current.value).toEqual([{ x: 10 }, { x: 0 }]);
		}, 1000);
	});

	it('should must be clone of repeater specific item', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'publisher-core/controls/repeater';
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { cloneRepeaterItem } = dispatch(storeName);

		cloneRepeaterItem({
			controlId: name,
			repeaterId: '[1]',
		});

		setTimeout(() => {
			const { result } = renderHook(
				() => {
					return useControlContext({
						repeater: {
							defaultRepeaterItemValue,
						},
						mergeInitialAndDefault: true,
					});
				},
				{
					wrapper,
				}
			);

			expect(result.current.value).toEqual([
				{ x: 10 },
				{ x: 0 },
				{ x: 0 },
			]);
		}, 1000);
	});

	it('should testing resetToDefault of retrieved control context api', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'publisher-core/controls/repeater';
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const {
			result: {
				current: { resetToDefault },
			},
		} = renderHook(
			() => {
				return useControlContext({
					repeater: {
						defaultRepeaterItemValue,
					},
					defaultValue: [{ x: 0 }],
					mergeInitialAndDefault: true,
				});
			},
			{
				wrapper,
			}
		);

		const { result } = renderHook(() => resetToDefault());

		expect(result.current).toEqual([{ x: 0 }]);
	});

	it('should testing resetToDefault of retrieved control context api in simple control', () => {
		const storeName = 'publisher-core/controls';
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: {
						x: {
							y: {
								b: [1, 2, 3],
							},
						},
					},
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const {
			result: {
				current: { resetToDefault },
			},
		} = renderHook(
			() => {
				return useControlContext({
					defaultValue: {
						x: {
							y: {
								b: [5, 5, 5],
							},
						},
					},
				});
			},
			{
				wrapper,
			}
		);

		const { result } = renderHook(() => resetToDefault());

		expect(result.current.x.y.b).toEqual([5, 5, 5]);
	});

	it('should testing resetToSavedValue of retrieved control context api', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'publisher-core/controls/repeater';
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const {
			result: {
				current: { resetToSavedValue },
			},
		} = renderHook(
			() => {
				return useControlContext({
					repeater: {
						defaultRepeaterItemValue,
					},
					defaultValue: [{ x: 0 }],
					mergeInitialAndDefault: true,
				});
			},
			{
				wrapper,
			}
		);

		const { result } = renderHook(() =>
			resetToSavedValue([{ x: 55 }, { x: 22 }])
		);

		expect(result.current).toEqual([{ x: 55 }, { x: 22 }]);
	});

	it('should testing toggleValue of retrieved control context api', () => {
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: true,
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const {
			result: {
				current: { toggleValue },
			},
		} = renderHook(() => useControlContext({ defaultValue: true }), {
			wrapper,
		});

		const {
			result: { current },
		} = renderHook(() => toggleValue());

		expect(current).toBe(false);
	});

	it('should testing toggleValue of retrieved control context api when control value was not boolean type!', function () {
		const name = getControlId();
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: [],
				}}
			>
				{children}
			</ControlContextProvider>
		);
		const {
			result: {
				current: { toggleValue },
			},
		} = renderHook(() => useControlContext({ defaultValue: true }), {
			wrapper,
		});

		const {
			result: { current },
		} = renderHook(() => toggleValue());

		expect(current).toBe(false);
	});
});
