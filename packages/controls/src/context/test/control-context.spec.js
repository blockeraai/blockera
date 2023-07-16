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

describe('testing control context provider and related hooks', () => {
	it('arguments not passed', () => {
		const { result } = renderHook(() => useControlContext());

		expect(result.current.value).toBe(null);
	});

	it('arguments includes id', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '1',
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

	it('arguments just includes defaultValue', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '2',
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

	it('arguments includes mergeInitialAndDefault', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '3',
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

	it('arguments includes mergeInitialAndDefault when repeater details is exists', () => {
		const defaultRepeaterItemValue = {
			y: 30,
		};
		const storeName = 'publisher-core/controls/repeater';

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '4',
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

	it('arguments includes repeater details when repeater is empty', () => {
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '5',
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

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '6',
					value: [],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { addRepeaterItem } = dispatch(storeName);

		addRepeaterItem({
			controlId: '6',
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

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '7',
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { changeRepeaterItem } = dispatch(storeName);

		changeRepeaterItem({
			controlId: '7',
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

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '8',
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { removeRepeaterItem } = dispatch(storeName);

		removeRepeaterItem({
			controlId: '8',
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

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '9',
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { removeRepeaterItem } = dispatch(storeName);

		removeRepeaterItem({
			controlId: '9',
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

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '10',
					value: [{ x: 0 }, { x: 10 }],
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { cloneRepeaterItem } = dispatch(storeName);

		cloneRepeaterItem({
			controlId: '10',
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

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '11',
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

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: 'x-test',
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

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '12',
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
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '13',
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
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: '14',
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
