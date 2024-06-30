// @flow
/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';
import { useContext, useCallback, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { prepare, update } from '@blockera/data-editor';
import {
	isNull,
	isEmpty,
	isObject,
	isBoolean,
	isUndefined,
} from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	store as controlStore,
	STORE_NAME as CONTROL_STORE_NAME,
} from '../../store';
import { STORE_NAME as REPEATER_STORE_NAME } from '../../libs/repeater-control/store/constants';
import useControlEffect from './use-control-effect';
import { BaseControlContext, ControlContext } from '../index';
import type { ControlContextHookProps, ControlContextRef } from '../types';
import { store as repeaterStore } from '../../libs/repeater-control/store';
import { isInnerBlock } from '@blockera/editor/js/extensions/components/utils';
import { repeaterOnChange } from '../../libs/repeater-control/store/reducers/utils';

//eslint-disable-next-line
/**
 * Use control context data as react custom hook!
 *
 * @param {Object} args the control arguments
 * @return {Object} retrieved object of helpers to work with control!
 */
export const useControlContext = (args?: ControlContextHookProps): Object => {
	const { components } = useContext(BaseControlContext);
	const {
		controlInfo,
		value: savedValue,
		dispatch,
	} = useContext(ControlContext);

	const getControlPath = function (
		controlID: string,
		childControlId: string
	): string {
		// Assume childControlId is undefined, then hint to context provider main value.
		if (isUndefined(childControlId)) {
			return controlID;
		}
		// Assume childControlId started with open bracket char as an example: "[0].toggleOption", then concat controlID and childControlId with no separator.
		if ('[' === childControlId[0]) {
			return `${controlID}${childControlId}`;
		}

		// Assume childControlId started with property word name as an example: "toggleOption", then concatenate "controlID" and "childControlId" with "dot | ." separator.
		return `${controlID}.${childControlId}`;
	};

	if ('undefined' === typeof args) {
		return {
			dispatch,
			components,
			controlInfo,
			getControlPath,
			value: savedValue,
			blockName: controlInfo.blockName,
		};
	}

	const {
		getExtensionCurrentBlock,
		getExtensionInnerBlockState,
		getExtensionCurrentBlockState,
		getExtensionCurrentBlockStateBreakpoint,
	} = select('blockera/extensions') || {};
	const { getSelectedBlock } = select('core/block-editor') || {};
	const { getBreakpoints } = select('blockera/editor') || {};

	const initialRef = {
		path: '',
		reset: false,
		action: 'normal',
	};

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const ref: ControlContextRef = useRef(initialRef);

	const resetRef = (): void => {
		if (ref) {
			ref.current = initialRef;
		}
	};

	/**
	 * is repeater control?
	 *
	 * @return {boolean} true on success, false when otherwise!
	 */
	const isRepeaterControl = (): boolean => {
		let isRepeater = false;
		const { getControl } = select(CONTROL_STORE_NAME);
		let control = getControl(controlInfo.name);

		if (!control) {
			control = select(REPEATER_STORE_NAME).getControl(controlInfo.name);

			if (control) {
				isRepeater = true;
			}
		}

		return isRepeater;
	};

	const { getControl } = isRepeaterControl()
		? select(REPEATER_STORE_NAME)
		: select(CONTROL_STORE_NAME);

	const {
		id,
		repeater: { repeaterId, defaultRepeaterItemValue } = {
			itemId: null,
			repeaterId: null,
			defaultRepeaterItemValue: null,
		},
		onChange,
		valueCleanup,
		defaultValue,
		mergeInitialAndDefault,
	} = args;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const normalizeRepeaterItems = useCallback((items: Object): Object => {
		if (isEmpty(items)) {
			return {};
		}

		const newRepeaterItems = Object.entries(items).map(([itemId, item]) => {
			if (isObject(item)) {
				return [
					itemId,
					{
						...defaultRepeaterItemValue,
						...item,
						...('undefined' === typeof item.isOpen
							? { isOpen: false }
							: {}),
					},
				];
			}

			return [itemId, item];
		});

		return Object.fromEntries(newRepeaterItems);
		// eslint-disable-next-line
	}, []);

	const _getCalculatedValue = memoize(() => getCalculatedInitValue());
	const calculatedValue = _getCalculatedValue();

	/**
	 * @see ../../store/actions.js file to check available actions of dispatcher!
	 */
	const { modifyControlValue } = dispatch;

	const modifyValue = (value: any): void => {
		const modify = (controlId: string) => {
			modifyControlValue({
				value,
				controlId,
				propId: id,
			});
		};

		if ('reset_all_states' === ref.current.action) {
			const {
				attributes: { blockeraBlockStates },
			} = getSelectedBlock();
			const states = Object.keys(blockeraBlockStates);
			const breakpoints = Object.keys(getBreakpoints());
			//get `blockera/controls` store or details of that
			const { getControl } = isRepeaterControl()
				? select(repeaterStore)
				: select(controlStore);

			states.forEach((state) => {
				const currentState = isInnerBlock(getExtensionCurrentBlock())
					? getExtensionInnerBlockState()
					: getExtensionCurrentBlockState();
				const controlName = controlInfo.name.replace(
					currentState,
					state
				);

				breakpoints.forEach((breakpoint) => {
					const name = controlName.replace(
						getExtensionCurrentBlockStateBreakpoint(),
						breakpoint
					);

					if (!getControl(name)) {
						return;
					}

					modify(name);
				});
			});

			resetRef();

			return value;
		}

		if ('reset' === ref.current.action) {
			resetRef();
		}

		// modify current control
		modify(controlInfo.name);

		return value;
	};

	//Call onChange function if is set valueCleanup as function to clean value else set all value details into parent state!
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const setValue = useControlEffect({
		onChange,
		valueCleanup,
		actionRefId: { ...ref },
	});

	/**
	 * Retrieved control value
	 * to merge default and saved value for simple or repeater controls.
	 *
	 * @param {any} currentValue the current control saved value.
	 *
	 * @return {null|*} retrieved standard calculated value for current control!
	 */
	function getCalculatedInitValue(currentValue: any = null): any {
		if (isNull(currentValue)) {
			currentValue = savedValue;
		}

		if (
			isUndefined(currentValue) ||
			isNull(currentValue) ||
			isEmpty(currentValue)
		) {
			return defaultValue;
		}

		if (mergeInitialAndDefault) {
			if (isObject(currentValue)) {
				// merge default value to object elements inside initialValue
				// used for repeaters
				if (isRepeaterControl()) {
					const repeaterValue = prepare(repeaterId, currentValue);

					if (isUndefined(repeaterId) || isUndefined(repeaterValue)) {
						return normalizeRepeaterItems(currentValue);
					}

					return !isObject(repeaterValue)
						? normalizeRepeaterItems(currentValue)
						: normalizeRepeaterItems(repeaterValue);
				}

				if (isObject(defaultValue)) {
					if (!isUndefined(id)) {
						return {
							...defaultValue,
							...prepare(id, currentValue),
						};
					}

					return { ...defaultValue, ...currentValue };
				}
			}
		}

		if (isUndefined(id)) {
			if (isEmpty(currentValue)) {
				return defaultValue;
			}

			return currentValue;
		}

		if (isEmpty(currentValue)) {
			return defaultValue;
		}

		const prep = prepare(id, currentValue);

		if (!isUndefined(prep)) {
			return prep;
		}

		return defaultValue;
	}

	/**
	 * Calculating value based on saved control value type ...
	 *
	 * @param {*} value the calculated vase based on recieved args.
	 * @param {Object} args The reset action arguments.
	 *
	 * @return {*} the calculated value base on control previous saved value.
	 */
	const calculatedValueBasedOnSavedValue = (
		value: any,
		args: Object
	): any => {
		if (isObject(savedValue) && args?.propId) {
			if (isUndefined(value)) {
				value = {
					...savedValue,
					[args?.propId]: defaultValue[args?.propId],
				};
			} else {
				value = update(savedValue, args.path, value);
			}
		} else if (isObject(savedValue) && isObject(defaultValue)) {
			value = {
				...savedValue,
				...(value || defaultValue),
			};
		}

		return value || '';
	};
	/**
	 * Resetting control value to default.
	 * use cases: all controls apart from repeater.
	 *
	 * @param {*} toValue the reset value.
	 *
	 * @return {*} the control default value.
	 */
	const reset = (toValue: any): any => {
		setValue(toValue, ref);

		return modifyValue(toValue);
	};
	/**
	 * Resetting repeater control ...
	 *
	 * @param {Object} args The reset action arguments.
	 * @param {Object} dataset The dataset object.
	 * @return {Object} the reset value.
	 */
	const resetRepeaterControl = (args: Object, dataset: Object): any => {
		const value = prepare(args?.path, dataset);

		if (isUndefined(args?.path) || isUndefined(value)) {
			if (args?.onChange) {
				repeaterOnChange(defaultValue, {
					...args,
					ref,
				});
			}

			return modifyValue(defaultValue);
		}

		if (args?.onChange) {
			repeaterOnChange(value, {
				...args,
				ref,
			});
		}

		return modifyValue(value);
	};
	/**
	 * Resetting field value of repeater item ...
	 *
	 * @param {*} value The resetting value.
	 * @param {Object} args The reset action arguments.
	 * @return {Object} The repeater control value.
	 */
	const resetRepeaterItemField = (value: any, args: Object): Object => {
		return Object.fromEntries(
			Object.entries(savedValue).map(
				([itemId, item]: [string, Object]): [string, Object] => {
					if (itemId !== args?.repeaterItem) {
						return [itemId, item];
					}

					return [
						itemId,
						{
							...item,
							[args.propId]: value,
						},
					];
				}
			)
		);
	};
	/**
	 * Updating ref based on argument action ...
	 *
	 * @param {Object} args The reset action arguments.
	 */
	const updateRef = (args: Object): void => {
		if (['RESET_TO_NORMAL', 'RESET_TO_DEFAULT'].includes(args?.action)) {
			ref.current = {
				reset: true,
				action: 'reset',
				path: args?.path,
			};

			return;
		}

		if ('RESET_ALL' === args?.action) {
			ref.current = {
				reset: true,
				path: args?.path,
				action: 'reset_all_states',
			};

			return;
		}

		resetRef();
	};

	return {
		dispatch,
		components,
		setValue: (value, _ref = undefined) => {
			setValue(value, _ref || ref);

			modifyValue(value);

			resetRef();
		},
		value: calculatedValue,
		blockName: controlInfo.blockName,
		attribute: controlInfo.attribute,
		controlInfo: getControl(controlInfo.name),
		getControlPath,
		/**
		 * Reset control value to default value.
		 */
		resetToDefault: (args: Object): any => {
			// Reference updating ...
			updateRef(args);

			let dataset = args?.attributes;

			switch (args?.action) {
				case 'RESET_ALL':
				case 'RESET_TO_DEFAULT':
					dataset = defaultValue;
					break;
				case 'RESET_TO_NORMAL':
					if (isRepeaterControl()) {
						dataset = prepare(args?.path, dataset);
					}
					break;
			}

			if (isRepeaterControl()) {
				if (!args?.isRepeater) {
					return reset(
						prepare(
							args?.repeaterItem + '.' + args?.propId,
							resetRepeaterItemField(dataset, args)
						)
					);
				}

				return resetRepeaterControl(args, dataset);
			}

			// Assume not sets path argument, then resetting to defaultValue ...
			if (isUndefined(args?.path)) {
				return reset(dataset);
			}

			return reset(
				calculatedValueBasedOnSavedValue(
					prepare(args?.path, dataset),
					args
				)
			);
		},
		// eslint-disable-next-line
		/**
		 * Toggle control value when value is boolean else returning false value.
		 *
		 * @return {boolean} toggled control value!
		 */
		toggleValue: (): boolean => {
			if (!isBoolean(calculatedValue)) {
				return false;
			}

			modifyControlValue({
				value: !calculatedValue,
				controlId: controlInfo.name,
			});

			return !calculatedValue;
		},
		/**
		 * Return
		 *
		 * @return {boolean} toggled control value!
		 */
		getId: (id: string, childId: string): string => {
			if (!isUndefined(id)) {
				return `${id}.${childId}`;
			}

			return childId;
		},
	};
};
