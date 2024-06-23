/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useControlContext } from '../hooks';
import { ControlContextProvider } from '../index';
import { registerControl } from '../../api/index';

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

	it('should retrieve context current value when id is invalid', () => {
		const value = {
			x: [
				{
					y: [{ isVisible: true }],
				},
			],
		};

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value,
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
					defaultValue: {
						0: { isVisible: true },
						1: { isVisible: true },
					},
					mergeInitialAndDefault: true,
				}),
			{
				wrapper,
			}
		);

		expect(result.current.value).toEqual({
			0: { isVisible: true },
			1: { isVisible: true },
			...value,
		});
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

	it('should merged value with defaultRepeaterItemValue when mergeInitialAndDefault flag is true', () => {
		const defaultRepeaterItemValue = {
			y: 30,
		};
		const storeName = 'blockera/controls/repeater';

		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name: getControlId(),
					value: {
						0: { x: 20 },
					},
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

		expect(result.current.value).toEqual({
			0: { ...defaultRepeaterItemValue, ...{ x: 20, isOpen: false } },
		});
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
		const storeName = 'blockera/controls/repeater';
		const name = getControlId();
		registerControl({
			name,
			value: {},
			type: storeName,
		});
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value: {},
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

			expect(result.current.value).toEqual({
				0: defaultRepeaterItemValue,
			});
		}, 1000);
	});

	it('should must be change repeater specific item', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'blockera/controls/repeater';
		const name = getControlId();
		const value = {
			0: { x: 0 },
			1: { x: 10 },
		};
		registerControl({
			name,
			value,
			type: storeName,
		});
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value,
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { changeRepeaterItem } = dispatch(storeName);

		changeRepeaterItem({
			controlId: name,
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

			expect(result.current.value).toEqual({
				0: { x: 0 },
				1: { x: 55 },
			});
		}, 1000);
	});

	it('should must be remove repeater specific item', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'blockera/controls/repeater';
		const name = getControlId();
		const value = {
			0: { x: 0 },
			1: { x: 10 },
		};
		registerControl({
			name,
			value,
			type: storeName,
		});
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value,
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { result } = renderHook(
			() => {
				const {
					controlInfo: { name: controlId },
					value,
					dispatch: { removeRepeaterItem },
				} = useControlContext({
					id: undefined,
					repeater: {
						defaultRepeaterItemValue,
					},
					mergeInitialAndDefault: true,
				});

				useEffect(() => {
					removeRepeaterItem({
						controlId,
						itemId: 1,
					});
				}, []);

				return value;
			},
			{
				wrapper,
			}
		);

		expect(result.current).toEqual({
			0: {
				order: 0,
				isOpen: false,
				x: 0,
				y: 20,
			},
		});
	});

	it.skip('should must be sort repeater items', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'blockera/controls/repeater';
		const name = getControlId();
		const value = {
			0: { x: 0, order: 0 },
			1: { x: 10, order: 1 },
		};
		registerControl({
			name,
			value,
			type: storeName,
		});
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value,
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { sortRepeaterItem } = dispatch(storeName);

		sortRepeaterItem({
			controlId: name,
			items: value,
			toIndex: 0,
			fromIndex: 1,
		});

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

		expect(result.current.value).toEqual({
			0: {
				isOpen: false,
				order: 1,
				x: 0,
				y: 20,
			},
			1: {
				isOpen: false,
				order: 0,
				x: 10,
				y: 20,
			},
		});
	});

	it('should must be clone of repeater specific item', () => {
		const defaultRepeaterItemValue = {
			y: 20,
		};
		const storeName = 'blockera/controls/repeater';
		const name = getControlId();
		const value = {
			0: { x: 0, order: 0 },
			1: { x: 10, order: 1 },
		};
		registerControl({
			name,
			value,
			type: storeName,
		});
		const wrapper = ({ children }) => (
			<ControlContextProvider
				value={{
					name,
					value,
				}}
				storeName={storeName}
			>
				{children}
			</ControlContextProvider>
		);

		const { result } = renderHook(
			() => {
				const {
					controlInfo: { name: controlId },
					value,
					dispatch: { cloneRepeaterItem },
				} = useControlContext({
					repeater: {
						defaultRepeaterItemValue,
					},
					mergeInitialAndDefault: true,
				});

				useEffect(() => {
					cloneRepeaterItem({
						controlId,
						itemId: 0,
					});
				}, []);

				return value;
			},
			{
				wrapper,
			}
		);

		expect(result.current).toEqual({
			0: {
				isOpen: false,
				order: 0,
				x: 0,
				y: 20,
			},
			1: {
				isOpen: false,
				order: 1,
				x: 10,
				y: 20,
			},
			2: {
				isOpen: false,
				order: 2,
				x: 0,
				y: 20,
			},
		});
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
