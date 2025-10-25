// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { detailedDiff } from 'deep-object-diff';
import { isEquals, omitWithPattern, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { prepareBlockeraDefaultAttributesValues } from '../extensions/components/utils';
import { ignoreDefaultBlockAttributeKeysRegExp } from '../extensions/libs';

export const useBlockCompatibilities = ({
	args,
	isActive,
	attributes,
	defaultAttributes,
	availableAttributes,
}: {
	args: Object,
	isActive: boolean,
	attributes: Object,
	defaultAttributes: Object,
	availableAttributes: Object,
}): Object => {
	return useMemo(() => {
		/**
		 * Filtering block attributes based on "blockeraCompatId" attribute value to running WordPress compatibilities.
		 * Create mutable constant to prevent directly change to immutable state constant.
		 *
		 * hook: 'blockera.blockEdit.compatibility.attributes'
		 *
		 * @since 1.0.0
		 */
		let filteredAttributes = applyFilters(
			'blockera.blockEdit.attributes',
			// Migrate to blockera attributes for some blocks where includes attributes migrations in original core Block Edit component,
			// if we supported them.
			'undefined' === typeof attributes?.blockeraPropsId &&
				availableAttributes?.blockeraPropsId
				? mergeObject(
						{ ...attributes },
						prepareBlockeraDefaultAttributesValues(
							defaultAttributes
						)
				  )
				: { ...attributes },
			args
		);

		const hasPropsId = attributes?.blockeraPropsId;
		const hasCompatId = attributes?.blockeraCompatId;

		// Assume disabled blockera panel, so filtering attributes to clean up all blockera attributes.
		if (!isActive && hasCompatId && hasPropsId) {
			filteredAttributes = {
				...attributes,
				...omitWithPattern(
					prepareBlockeraDefaultAttributesValues(defaultAttributes),
					ignoreDefaultBlockAttributeKeysRegExp()
				),
			};
		}

		// Prevent redundant set state!
		if (isEquals(attributes, filteredAttributes)) {
			return attributes;
		}

		const filteredAttributesWithoutIds = {
			...filteredAttributes,
			blockeraPropsId: '',
			blockeraCompatId: '',
			...(attributes.hasOwnProperty('className')
				? { className: attributes?.className || '' }
				: {}),
		};

		const { added, updated } = detailedDiff(
			filteredAttributesWithoutIds,
			prepareBlockeraDefaultAttributesValues(defaultAttributes)
		);

		// Our Goal is cleanup blockera attributes of core blocks when not changed anything!
		if (
			!Object.keys(added).length &&
			!Object.keys(updated).length &&
			isEquals(attributes, filteredAttributesWithoutIds)
		) {
			return attributes;
		}

		return filteredAttributes;
	}, [
		attributes,
		defaultAttributes,
		isActive,
		args,
		availableAttributes?.blockeraPropsId,
	]);
};
