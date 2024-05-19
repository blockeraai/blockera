// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/editor';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import { getCssSelector, computedCssDeclarations } from '../../../style-engine';

export const PositionStyles = ({
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
	const { blockeraPosition, blockeraZIndex } = config.positionConfig;
	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};
	const { attributes: _attributes } = blockProps;
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

	if (
		isActiveField(blockeraPosition) &&
		_attributes?.blockeraPosition &&
		_attributes.blockeraPosition !== attributes.blockeraPosition.default &&
		_attributes.blockeraPosition.type !== 'static'
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraPosition.type',
			fallbackSupportId: 'position',
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
				blockProps
			),
		});

		const positionTop = getValueAddonRealValue(
			_attributes.blockeraPosition.position?.top
		);
		if (positionTop !== '') {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraPosition.position.top',
				fallbackSupportId: 'positionTop',
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
					blockProps
				),
			});
		}

		const positionRight = getValueAddonRealValue(
			_attributes.blockeraPosition.position?.right
		);
		if (positionRight !== '') {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraPosition.position.right',
				fallbackSupportId: 'positionRight',
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
					blockProps
				),
			});
		}

		const positionBottom = getValueAddonRealValue(
			_attributes.blockeraPosition.position?.bottom
		);
		if (positionBottom !== '') {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraPosition.position.bottom',
				fallbackSupportId: 'positionBottom',
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
					blockProps
				),
			});
		}

		const positionLeft = getValueAddonRealValue(
			_attributes.blockeraPosition.position?.left
		);
		if (positionLeft !== '') {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraPosition.position.left',
				fallbackSupportId: 'positionLeft',
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
					blockProps
				),
			});
		}

		if (isActiveField(blockeraZIndex)) {
			const zIndex = getValueAddonRealValue(_attributes.blockeraZIndex);

			if (zIndex !== attributes.blockeraZIndex.default) {
				const pickedSelector = getCssSelector({
					...sharedParams,
					query: 'blockeraZIndex',
					support: 'blockeraZIndex',
					fallbackSupportId: 'zIndex',
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
						blockProps
					),
				});
			}
		}
	}

	return styleGroup;
};
