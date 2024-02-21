// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	computedCssRules,
	Style,
	getCssSelectors,
} from '@publisher/style-engine';
import { isUndefined, isEmpty, hasSameProps } from '@publisher/utils';
import { getValueAddonRealValue } from '@publisher/hooks';
import { getSelector } from '@publisher/style-engine/src/utils';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import { arrayEquals } from '../utils';
import type { TSizeCssProps } from './types/size-props';

export const SizeStyles: Element<any> = memo(
	({
		state,
		clientId,
		blockName,
		currentBlock,
		// supports,
		// activeDeviceType,
		selectors: blockSelectors,
		attributes: currentBlockAttributes,
	}: StylesProps): Element<any> => {
		const {
			publisherWidth,
			publisherHeight,
			publisherMinWidth,
			publisherMinHeight,
			publisherMaxWidth,
			publisherMaxHeight,
			publisherOverflow,
			publisherRatio,
			publisherFit,
		} = config.sizeConfig;
		const blockProps = {
			clientId,
			blockName,
			attributes: currentBlockAttributes,
		};
		const generators = [];
		const properties: TSizeCssProps = {};
		const selectors = getCssSelectors({
			currentBlock,
			blockSelectors,
			currentState: state,
			fallbackSupportId: 'size',
			supportId: 'publisherSize',
		});
		const selector = getSelector({
			state,
			clientId,
			selectors,
			currentBlock,
			className: currentBlockAttributes?.className,
		});

		// const mappedStyles = [];

		if (
			isActiveField(publisherWidth) &&
			currentBlockAttributes?.publisherWidth
		) {
			const width = getValueAddonRealValue(
				currentBlockAttributes.publisherWidth
			);

			if (width !== attributes.publisherWidth.default)
				properties.width = width;
			else if (
				!isUndefined(currentBlockAttributes.width) &&
				!isEmpty(currentBlockAttributes.width)
			) {
				properties.width = currentBlockAttributes.width;
				// mappedStyles.push(<Style selector={selector} cssDeclaration={properties} /> );
			}
		}

		if (
			isActiveField(publisherMinWidth) &&
			currentBlockAttributes?.publisherMinWidth
		) {
			const minWidth = getValueAddonRealValue(
				currentBlockAttributes.publisherMinWidth
			);

			if (minWidth !== attributes.publisherMinWidth.default)
				properties['min-width'] = minWidth;
		}

		if (
			isActiveField(publisherMaxWidth) &&
			currentBlockAttributes?.publisherMaxWidth
		) {
			const maxWidth = getValueAddonRealValue(
				currentBlockAttributes.publisherMaxWidth
			);

			if (maxWidth !== attributes.publisherMaxWidth.default)
				properties['max-width'] = maxWidth;
		}

		if (
			isActiveField(publisherHeight) &&
			currentBlockAttributes?.publisherHeight
		) {
			const height = getValueAddonRealValue(
				currentBlockAttributes.publisherHeight
			);

			if (height !== attributes.publisherHeight.default)
				properties.height = height;
			else if (
				!isUndefined(currentBlockAttributes.height) &&
				!isEmpty(currentBlockAttributes.height)
			) {
				properties.height = currentBlockAttributes.height;
			}
		}

		if (
			isActiveField(publisherMinHeight) &&
			currentBlockAttributes?.publisherMinHeight
		) {
			const minHeight = getValueAddonRealValue(
				currentBlockAttributes.publisherMinHeight
			);

			if (minHeight !== attributes.publisherMinHeight.default)
				properties['min-height'] = minHeight;
		}

		if (
			isActiveField(publisherMaxHeight) &&
			currentBlockAttributes?.publisherMaxHeight
		) {
			const maxHeight = getValueAddonRealValue(
				currentBlockAttributes.publisherMaxHeight
			);

			if (maxHeight !== attributes.publisherMaxHeight.default)
				properties['max-height'] = maxHeight;
		}

		if (
			isActiveField(publisherOverflow) &&
			currentBlockAttributes?.publisherOverflow
		) {
			if (
				currentBlockAttributes.publisherOverflow !==
				attributes.publisherOverflow.default
			)
				properties.overflow = currentBlockAttributes.publisherOverflow;
		}

		if (
			isActiveField(publisherRatio) &&
			currentBlockAttributes?.publisherRatio
		) {
			const ratio = currentBlockAttributes.publisherRatio.value;

			if (ratio !== attributes.publisherRatio.default.value)
				switch (ratio) {
					case 'custom':
						{
							const width = getValueAddonRealValue(
								currentBlockAttributes.publisherRatio.width
							);
							const height = getValueAddonRealValue(
								currentBlockAttributes.publisherRatio.height
							);

							properties['aspect-ratio'] = `${width} ${
								width && height && ' / '
							} ${height}`;
						}
						break;
					default:
						properties['aspect-ratio'] = ratio;
				}
		}

		if (
			isActiveField(publisherFit) &&
			currentBlockAttributes?.publisherFit &&
			currentBlockAttributes.publisherFit !==
				attributes.publisherFit.default
		) {
			properties['object-fit'] = currentBlockAttributes.publisherFit;
		}

		if (
			currentBlockAttributes?.publisherFitPosition &&
			!arrayEquals(
				currentBlockAttributes.publisherFitPosition,
				attributes.publisherFitPosition.default
			)
		) {
			properties['object-position'] = `${getValueAddonRealValue(
				currentBlockAttributes.publisherFitPosition.top
			)} ${getValueAddonRealValue(
				currentBlockAttributes.publisherFitPosition.left
			)}`;
		}

		if (Object.keys(properties).length > 0) {
			generators.push(
				computedCssRules(
					{
						publisherWidth: [
							{
								type: 'static',
								properties,
								options: {
									important: true,
								},
							},
						],
					},
					blockProps
				)
			);
		}

		return <Style selector={selector} cssDeclaration={generators.flat()} />;
	},
	hasSameProps
);
