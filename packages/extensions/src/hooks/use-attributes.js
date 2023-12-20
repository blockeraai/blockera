// @flow

/**
 * Internal dependencies
 */
import type { THandleOnChangeAttributes } from '../libs/types';
import { deletePropertyByPath } from '@publisher/utils';

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
	const handleOnChangeAttributes: THandleOnChangeAttributes = (
		attributeId,
		newValue,
		options = {}
	): void => {
		const {
			ref,
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
			if (ref?.reset) {
				const newAttributes = {
					..._attributes,
				};

				deletePropertyByPath(
					newAttributes,
					ref.path.replace(/\[/g, '.').replace(/]/g, '')
				);

				return {
					...newAttributes,
					[attributeId]: newValue,
				};
			}

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

							if (ref?.reset) {
								const newAttributes = {
									...breakpoint.attributes,
								};

								deletePropertyByPath(
									newAttributes,
									ref.path
										.replace(/\[/g, '.')
										.replace(/]/g, '')
								);

								return {
									...breakpoint,
									attributes: newAttributes,
								};
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
