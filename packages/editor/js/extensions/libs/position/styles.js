// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import {
	getCompatibleBlockCssSelector,
	computedCssDeclarations,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('position');

export const PositionStyles = ({
	state,
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	supports: blockSupports,
	selectors: blockSelectors,
	defaultAttributes: attributes,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	// Create cache key from inputs that affect output
	const cacheKey = JSON.stringify({
		blockeraPosition: currentBlockAttributes.blockeraPosition,
		blockeraZIndex: currentBlockAttributes.blockeraZIndex,
		state,
		clientId,
		blockName,
		masterState,
		activeDeviceType,
		blockSelectors,
		className: currentBlockAttributes?.className,
	});

	// Check if we have cached result
	if ((PositionStyles: any).cache?.[cacheKey]) {
		return (PositionStyles: any).cache[cacheKey];
	}

	const { blockeraPosition, blockeraZIndex } = config.positionConfig;
	const blockProps = {
		state,
		clientId,
		blockName,
		currentBlock,
		attributes: currentBlockAttributes,
	};
	const { attributes: _attributes } = blockProps;
	const sharedParams = {
		...props,
		state,
		clientId,
		blockName,
		masterState,
		currentBlock,
		blockSelectors,
		activeDeviceType,
		supports: blockSupports,
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
		isActiveField(blockeraPosition) &&
		_attributes?.blockeraPosition &&
		_attributes.blockeraPosition !== attributes.blockeraPosition.default &&
		_attributes.blockeraPosition.type !== 'static'
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraPosition.type',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraPosition'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraPosition: [
						{
							...staticDefinitionParams,
							properties: {
								position: _attributes.blockeraPosition.type,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});

		const positionTop = getValueAddonRealValue(
			_attributes.blockeraPosition.position?.top
		);
		if (positionTop !== '') {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraPosition.position.top',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraPosition'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraPositionTop: [
							{
								...staticDefinitionParams,
								properties: {
									top: positionTop,
								},
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}

		const positionRight = getValueAddonRealValue(
			_attributes.blockeraPosition.position?.right
		);
		if (positionRight !== '') {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraPosition.position.right',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraPosition'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraPositionRight: [
							{
								...staticDefinitionParams,
								properties: {
									right: positionRight,
								},
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}

		const positionBottom = getValueAddonRealValue(
			_attributes.blockeraPosition.position?.bottom
		);
		if (positionBottom !== '') {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraPosition.position.bottom',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraPosition'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraPositionBottom: [
							{
								...staticDefinitionParams,
								properties: {
									bottom: positionBottom,
								},
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}

		const positionLeft = getValueAddonRealValue(
			_attributes.blockeraPosition.position?.left
		);
		if (positionLeft !== '') {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraPosition.position.left',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraPosition'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraPositionLeft: [
							{
								...staticDefinitionParams,
								properties: {
									left: positionLeft,
								},
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}

		if (isActiveField(blockeraZIndex)) {
			const zIndex = getValueAddonRealValue(_attributes.blockeraZIndex);

			if (zIndex !== attributes.blockeraZIndex.default) {
				const pickedSelector = getCompatibleBlockCssSelector({
					...sharedParams,
					query: 'blockeraZIndex',
					support: 'blockeraZIndex',
					fallbackSupportId: getBlockSupportFallback(
						supports,
						'blockeraZIndex'
					),
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraZIndex: [
								{
									...staticDefinitionParams,
									properties: {
										'z-index': zIndex,
									},
								},
							],
						},
						blockProps,
						pickedSelector
					),
				});
			}
		}
	}

	// Cache the result
	if (!(PositionStyles: any).cache) {
		(PositionStyles: any).cache = {};
	}
	(PositionStyles: any).cache[cacheKey] = styleGroup;

	return styleGroup;
};
