// @flow

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';
import { update } from '@publisher/data-extractor';

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
		if (typeof attributeId === 'object') {
			setAttributes({ ...attributes, ...attributeId });

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
