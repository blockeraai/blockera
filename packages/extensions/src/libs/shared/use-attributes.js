// @flow

/**
 * Blockera dependencies
 */
import { isFunction } from '@blockera/utils';
import { update } from '@blockera/data-extractor';

/**
 * Internal dependencies
 */
import type { THandleOnChangeAttributes } from '../types';

export const useAttributes = (
	attributes: Object,
	setAttributes: (attributes: Object) => void
): {
	handleOnChangeAttributes: THandleOnChangeAttributes,
} => {
	const handleOnChangeAttributes: THandleOnChangeAttributes = (
		attributeId,
		attributeValue,
		query,
		callback
	): void => {
		if (null === attributeId && 'object' === typeof attributeValue) {
			setAttributes({ ...attributes, ...attributeValue });

			return;
		}
		const afterAll = (_attributes: Object): void =>
			isFunction(callback) &&
			callback &&
			callback(_attributes, setAttributes);

		if (query) {
			const _attributes = {
				...attributes,
				...update(attributes, query, attributeValue),
				[attributeId]: attributeValue,
			};

			setAttributes(_attributes);
			afterAll(_attributes);

			return;
		}

		const _attributes = {
			...attributes,
			[attributeId]: attributeValue,
		};

		setAttributes(_attributes);
		afterAll(_attributes);
	};

	return {
		handleOnChangeAttributes,
	};
};
