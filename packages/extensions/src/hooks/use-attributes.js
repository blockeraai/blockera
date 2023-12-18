// @flow

/**
 * Internal dependencies
 */
import type { THandleOnChangeAttributes } from '../libs/types';

export const useAttributes = (
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	{
		breakpointId,
		blockStateId,
		isNormalState,
	}: {
		blockStateId: number,
		breakpointId: number,
		isNormalState: () => boolean,
	}
): {
	handleOnChangeAttributes: THandleOnChangeAttributes,
} => {
	function deletePropertyByPath(obj: Object, path: string): void {
		const keys = path.split('.');
		let current = obj;

		for (let i = 0; i < keys.length - 1; i++) {
			if (!current[keys[i]]) {
				return; // Property doesn't exist, nothing to delete
			}
			current = current[keys[i]];
		}

		delete current[keys[keys.length - 1]];
	}

	const handleOnChangeAttributes: THandleOnChangeAttributes = (
		attributeId,
		newValue,
		options = {}
	): void => {
		const {
			updateItems = {},
			deleteItems = [],
			addOrModifyRootItems = {},
		} = options;
		let _attributes = { ...attributes, ...addOrModifyRootItems };

		// Assume existed deleteItems.
		for (let i = 0; i < deleteItems?.length - 1; i++) {
			deletePropertyByPath(_attributes, deleteItems[i]);
		}

		// Assume activated state is normal and existed "updateItems" has items!
		if (
			'object' === typeof updateItems &&
			Object.values(updateItems)?.length &&
			isNormalState()
		) {
			_attributes = {
				..._attributes,
				...updateItems,
			};
		}

		// Assume attribute id is string, and activated state is normal, or attribute ["publisherCurrentState" or "publisherBlockStates"] will change!
		if (
			'string' === typeof attributeId &&
			(isNormalState() ||
				['publisherCurrentState', 'publisherBlockStates'].includes(
					attributeId
				))
		) {
			setAttributes({
				..._attributes,
				[attributeId]: newValue,
			});

			return;
		}

		// This paradigm to handle update attributes in activated state and breakpoint!
		setAttributes({
			..._attributes,
			publisherBlockStates: _attributes.publisherBlockStates.map(
				(state, id) => {
					if (blockStateId !== id) {
						return state;
					}

					return {
						...state,
						breakpoints: state.breakpoints.map((breakpoint, id) => {
							if (breakpointId !== id) {
								return breakpoint;
							}

							if ('string' !== typeof attributeId) {
								return breakpoint;
							}

							if (
								'object' === typeof updateItems &&
								Object.values(updateItems)?.length
							) {
								breakpoint = {
									...breakpoint,
									attributes: {
										...breakpoint.attributes,
										...updateItems,
									},
								};
							}

							return {
								...breakpoint,
								attributes: {
									...breakpoint.attributes,
									[attributeId]: newValue,
								},
							};
						}),
					};
				}
			),
		});
	};

	return {
		handleOnChangeAttributes,
	};
};
