// @flow

/**
 * Blockera dependencies
 */
import { isUndefined, isEmpty } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import {
	getCompatibleBlockCssSelector,
	computedCssDeclarations,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('size');

export const SizeStyles = ({
	state,
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	selectors: blockSelectors,
	defaultAttributes: attributes,
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
		blockeraBoxSizing,
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
		blockName,
		masterState,
		currentBlock,
		blockSelectors,
		activeDeviceType,
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

		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraWidth',
			support: 'blockeraWidth',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraWidth'
			),
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraMinWidth',
				support: 'blockeraMinWidth',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraMinWidth'
				),
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraMaxWidth',
				support: 'blockeraMaxWidth',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraMaxWidth'
				),
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraHeight',
				support: 'blockeraHeight',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraHeight'
				),
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraMinHeight',
				support: 'blockeraMinHeight',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraMinHeight'
				),
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraMaxHeight',
				support: 'blockeraMaxHeight',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraMaxHeight'
				),
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraOverflow',
				support: 'blockeraOverflow',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraOverflow'
				),
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

			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraRatio',
				support: 'blockeraRatio',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraRatio'
				),
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
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraFit',
			support: 'blockeraFit',
			fallbackSupportId: getBlockSupportFallback(supports, 'blockeraFit'),
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
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraFitPosition',
			support: 'blockeraFitPosition',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraFitPosition'
			),
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

	if (
		isActiveField(blockeraBoxSizing) &&
		currentBlockAttributes?.blockeraBoxSizing
	) {
		if (
			currentBlockAttributes.blockeraBoxSizing !==
			attributes.blockeraBoxSizing.default
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraBoxSizing',
				support: 'blockeraBoxSizing',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraBoxSizing'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraBoxSizing: [
							{
								properties: {
									'box-sizing':
										currentBlockAttributes.blockeraBoxSizing,
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

	return styleGroup;
};
