// @flow

/**
 * Blockera dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@blockera/style-engine';
import { isUndefined, isEmpty } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/hooks';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '@blockera/style-engine/src/types';

export const SizeStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const {
		blockeraWidth,
		blockeraHeight,
		blockeraMinWidth,
		blockeraMinHeight,
		blockeraMaxWidth,
		blockeraMaxHeight,
		blockeraOverflow,
		blockeraRatio,
		blockeraFit,
	} = config.sizeConfig;
	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};
	const sharedParams = {
		...props,
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

	if (isActiveField(blockeraWidth) && currentBlockAttributes?.blockeraWidth) {
		const width = getValueAddonRealValue(
			currentBlockAttributes.blockeraWidth
		);
		let value = '';

		if (width !== attributes.blockeraWidth.default) {
			value = width;
		} else if (
			!isUndefined(currentBlockAttributes.width) &&
			!isEmpty(currentBlockAttributes.width)
		) {
			value = currentBlockAttributes.width;
		}

		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraWidth',
			support: 'blockeraWidth',
			fallbackSupportId: 'width',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraWidth: [
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
		isActiveField(blockeraMinWidth) &&
		currentBlockAttributes?.blockeraMinWidth
	) {
		const minWidth = getValueAddonRealValue(
			currentBlockAttributes.blockeraMinWidth
		);

		if (minWidth !== attributes.blockeraMinWidth.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraMinWidth',
				support: 'blockeraMinWidth',
				fallbackSupportId: 'minWidth',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraMinWidth: [
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
		isActiveField(blockeraMaxWidth) &&
		currentBlockAttributes?.blockeraMaxWidth
	) {
		const maxWidth = getValueAddonRealValue(
			currentBlockAttributes.blockeraMaxWidth
		);

		if (maxWidth !== attributes.blockeraMaxWidth.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraMaxWidth',
				support: 'blockeraMaxWidth',
				fallbackSupportId: 'maxWidth',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraMaxWidth: [
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
		isActiveField(blockeraHeight) &&
		currentBlockAttributes?.blockeraHeight
	) {
		const height = getValueAddonRealValue(
			currentBlockAttributes.blockeraHeight
		);

		let value = '';

		if (height !== attributes.blockeraHeight.default) {
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
				query: 'blockeraHeight',
				support: 'blockeraHeight',
				fallbackSupportId: 'height',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraHeight: [
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
		isActiveField(blockeraMinHeight) &&
		currentBlockAttributes?.blockeraMinHeight
	) {
		const minHeight = getValueAddonRealValue(
			currentBlockAttributes.blockeraMinHeight
		);

		if (minHeight !== attributes.blockeraMinHeight.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraMinHeight',
				support: 'blockeraMinHeight',
				fallbackSupportId: 'minHeight',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraHeight: [
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
		isActiveField(blockeraMaxHeight) &&
		currentBlockAttributes?.blockeraMaxHeight
	) {
		const maxHeight = getValueAddonRealValue(
			currentBlockAttributes.blockeraMaxHeight
		);

		if (maxHeight !== attributes.blockeraMaxHeight.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraMaxHeight',
				support: 'blockeraMaxHeight',
				fallbackSupportId: 'maxHeight',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraMaxHeight: [
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
		isActiveField(blockeraOverflow) &&
		currentBlockAttributes?.blockeraOverflow
	) {
		if (
			currentBlockAttributes.blockeraOverflow !==
			attributes.blockeraOverflow.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraOverflow',
				support: 'blockeraOverflow',
				fallbackSupportId: 'overflow',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraOverflow: [
							{
								properties: {
									overflow:
										currentBlockAttributes.blockeraOverflow,
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

	if (isActiveField(blockeraRatio) && currentBlockAttributes?.blockeraRatio) {
		const ratio = currentBlockAttributes.blockeraRatio.value;

		if (ratio !== attributes.blockeraRatio.default.value) {
			let value = '';

			switch (ratio) {
				case 'custom':
					{
						const width = getValueAddonRealValue(
							currentBlockAttributes.blockeraRatio.width
						);
						const height = getValueAddonRealValue(
							currentBlockAttributes.blockeraRatio.height
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
				query: 'blockeraRatio',
				support: 'blockeraRatio',
				fallbackSupportId: 'aspectRatio',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraRatio: [
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
		isActiveField(blockeraFit) &&
		currentBlockAttributes?.blockeraFit &&
		currentBlockAttributes.blockeraFit !== attributes.blockeraFit.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraFit',
			support: 'blockeraFit',
			fallbackSupportId: 'fit',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraFit: [
						{
							properties: {
								'object-fit':
									currentBlockAttributes.blockeraFit,
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
		currentBlockAttributes?.blockeraFitPosition &&
		!arrayEquals(
			currentBlockAttributes.blockeraFitPosition,
			attributes.blockeraFitPosition.default
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraFitPosition',
			support: 'blockeraFitPosition',
			fallbackSupportId: 'fitPosition',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraFitPosition: [
						{
							properties: {
								'object-position': `${getValueAddonRealValue(
									currentBlockAttributes.blockeraFitPosition
										.top
								)} ${getValueAddonRealValue(
									currentBlockAttributes.blockeraFitPosition
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
