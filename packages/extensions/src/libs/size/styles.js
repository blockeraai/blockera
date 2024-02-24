// @flow

/**
 * Publisher dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@publisher/style-engine';
import { isUndefined, isEmpty } from '@publisher/utils';
import { getValueAddonRealValue } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '@publisher/style-engine/src/types';

export const SizeStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
}: StylesProps): Array<CssRule> => {
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
	const sharedParams = {
		state,
		clientId,
		currentBlock,
		blockSelectors,
		className: currentBlockAttributes?.className,
	};
	const staticDefinitionParams = {
		type: 'static',
		options: {
			important: true,
		},
	};
	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(publisherWidth) &&
		currentBlockAttributes?.publisherWidth
	) {
		const width = getValueAddonRealValue(
			currentBlockAttributes.publisherWidth
		);
		let value = '';

		if (width !== attributes.publisherWidth.default) {
			value = width;
		} else if (
			!isUndefined(currentBlockAttributes.width) &&
			!isEmpty(currentBlockAttributes.width)
		) {
			value = currentBlockAttributes.width;
		}

		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherWidth',
			support: 'publisherWidth',
			fallbackSupportId: 'width',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherWidth: [
						{
							...staticDefinitionParams,
							properties: {
								width: value,
							},
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		isActiveField(publisherMinWidth) &&
		currentBlockAttributes?.publisherMinWidth
	) {
		const minWidth = getValueAddonRealValue(
			currentBlockAttributes.publisherMinWidth
		);

		if (minWidth !== attributes.publisherMinWidth.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherMinWidth',
				support: 'publisherMinWidth',
				fallbackSupportId: 'minWidth',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherMinWidth: [
							{
								properties: {
									'min-width': minWidth,
								},
								...staticDefinitionParams,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(publisherMaxWidth) &&
		currentBlockAttributes?.publisherMaxWidth
	) {
		const maxWidth = getValueAddonRealValue(
			currentBlockAttributes.publisherMaxWidth
		);

		if (maxWidth !== attributes.publisherMaxWidth.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherMaxWidth',
				support: 'publisherMaxWidth',
				fallbackSupportId: 'maxWidth',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherMaxWidth: [
							{
								properties: {
									'max-width': maxWidth,
								},
								...staticDefinitionParams,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(publisherHeight) &&
		currentBlockAttributes?.publisherHeight
	) {
		const height = getValueAddonRealValue(
			currentBlockAttributes.publisherHeight
		);

		let value = '';

		if (height !== attributes.publisherHeight.default) {
			value = height;
		} else if (
			!isUndefined(currentBlockAttributes.height) &&
			!isEmpty(currentBlockAttributes.height)
		) {
			value = currentBlockAttributes.height;
		}

		if (value.trim()) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherHeight',
				support: 'publisherHeight',
				fallbackSupportId: 'height',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherHeight: [
							{
								properties: {
									height: value,
								},
								...staticDefinitionParams,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(publisherMinHeight) &&
		currentBlockAttributes?.publisherMinHeight
	) {
		const minHeight = getValueAddonRealValue(
			currentBlockAttributes.publisherMinHeight
		);

		if (minHeight !== attributes.publisherMinHeight.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherMinHeight',
				support: 'publisherMinHeight',
				fallbackSupportId: 'minHeight',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherHeight: [
							{
								properties: {
									'min-height': minHeight,
								},
								...staticDefinitionParams,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(publisherMaxHeight) &&
		currentBlockAttributes?.publisherMaxHeight
	) {
		const maxHeight = getValueAddonRealValue(
			currentBlockAttributes.publisherMaxHeight
		);

		if (maxHeight !== attributes.publisherMaxHeight.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherMaxHeight',
				support: 'publisherMaxHeight',
				fallbackSupportId: 'maxHeight',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherMaxHeight: [
							{
								properties: {
									'max-height': maxHeight,
								},
								...staticDefinitionParams,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(publisherOverflow) &&
		currentBlockAttributes?.publisherOverflow
	) {
		if (
			currentBlockAttributes.publisherOverflow !==
			attributes.publisherOverflow.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherOverflow',
				support: 'publisherOverflow',
				fallbackSupportId: 'overflow',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherOverflow: [
							{
								properties: {
									overflow:
										currentBlockAttributes.publisherOverflow,
								},
								...staticDefinitionParams,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(publisherRatio) &&
		currentBlockAttributes?.publisherRatio
	) {
		const ratio = currentBlockAttributes.publisherRatio.value;

		if (ratio !== attributes.publisherRatio.default.value) {
			let value = '';

			switch (ratio) {
				case 'custom':
					{
						const width = getValueAddonRealValue(
							currentBlockAttributes.publisherRatio.width
						);
						const height = getValueAddonRealValue(
							currentBlockAttributes.publisherRatio.height
						);

						value = `${width} ${
							width && height && ' / '
						} ${height}`;
					}
					break;
				default:
					value = ratio;
			}

			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherRatio',
				support: 'publisherRatio',
				fallbackSupportId: 'aspectRatio',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherRatio: [
							{
								properties: {
									'aspect-ratio': value,
								},
								...staticDefinitionParams,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(publisherFit) &&
		currentBlockAttributes?.publisherFit &&
		currentBlockAttributes.publisherFit !== attributes.publisherFit.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherFit',
			support: 'publisherFit',
			fallbackSupportId: 'fit',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherFit: [
						{
							properties: {
								'object-fit':
									currentBlockAttributes.publisherFit,
							},
							...staticDefinitionParams,
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		currentBlockAttributes?.publisherFitPosition &&
		!arrayEquals(
			currentBlockAttributes.publisherFitPosition,
			attributes.publisherFitPosition.default
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherFitPosition',
			support: 'publisherFitPosition',
			fallbackSupportId: 'fitPosition',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherFitPosition: [
						{
							properties: {
								'object-position': `${getValueAddonRealValue(
									currentBlockAttributes.publisherFitPosition
										.top
								)} ${getValueAddonRealValue(
									currentBlockAttributes.publisherFitPosition
										.left
								)}`,
							},
							...staticDefinitionParams,
						},
					],
				},
				blockProps
			),
		});
	}

	return styleGroup;
};
