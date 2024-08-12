// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { memo, useEffect } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { detailedDiff } from 'deep-object-diff';
import { isEquals, mergeObject, omit, omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { prepareAttributesDefaultValues } from './utils';
import { ignoreDefaultBlockAttributeKeysRegExp } from '../libs';

export const BlockCompatibility: ComponentType<any> = memo(
	({
		args,
		isActive,
		attributes,
		setCompatibilities,
		defaultAttributes,
		originalAttributes,
		availableAttributes,
		getAttributesWithIds,
	}: {
		args: Object,
		isActive: boolean,
		attributes: Object,
		defaultAttributes: Object,
		originalAttributes: Object,
		availableAttributes: Object,
		setCompatibilities: (attributes: Object) => void,
		getAttributesWithIds: (attributes: Object, id: string) => Object,
	}): MixedElement => {
		useEffect(
			() => {
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
					{ ...attributes },
					args
				);

				const hasPropsId = attributes?.blockeraPropsId;
				const hasCompatId = attributes?.blockeraCompatId;

				if (!hasCompatId) {
					filteredAttributes = getAttributesWithIds(
						// Migrate to blockera attributes for some blocks where includes attributes migrations in original core Block Edit component,
						// if we supported them.
						'undefined' ===
							typeof filteredAttributes?.blockeraPropsId &&
							availableAttributes?.blockeraPropsId
							? mergeObject(
									filteredAttributes,
									prepareAttributesDefaultValues(
										defaultAttributes
									)
							  )
							: filteredAttributes,
						'blockeraCompatId'
					);
				}

				// Assume disabled blockera panel, so filtering attributes to clean up all blockera attributes.
				if (!isActive && hasCompatId && hasPropsId) {
					filteredAttributes = {
						...attributes,
						...omitWithPattern(
							prepareAttributesDefaultValues(defaultAttributes),
							ignoreDefaultBlockAttributeKeysRegExp()
						),
					};
				}

				// Prevent redundant set state!
				if (isEquals(attributes, filteredAttributes)) {
					return;
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
					prepareAttributesDefaultValues(defaultAttributes)
				);

				// Our Goal is cleanup blockera attributes of core blocks when not changed anything!
				if (
					!Object.keys(added).length &&
					!Object.keys(updated).length &&
					isEquals(attributes, filteredAttributesWithoutIds)
				) {
					return;
				}

				if (hasCompatId && !hasPropsId) {
					filteredAttributes = getAttributesWithIds(
						filteredAttributes,
						'blockeraPropsId'
					);
				}

				setCompatibilities(filteredAttributes);
			},
			// eslint-disable-next-line
			[isActive, originalAttributes]
		);

		return <></>;
	},
	(perv, next) => {
		const keys: Array<string> = [
			'getAttributesWithIds',
			'setCompatibilities',
		];

		return isEquals(omit(perv, keys), omit(next, keys));
	}
);
