// @flow

/**
 * Publisher dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';
import type { CssRule } from '@publisher/style-engine/src/types';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';

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
	const { publisherPosition, publisherZIndex } = config.positionConfig;
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
		isActiveField(publisherPosition) &&
		_attributes?.publisherPosition &&
		_attributes.publisherPosition !==
			attributes.publisherPosition.default &&
		_attributes.publisherPosition.type !== 'static'
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherPosition.type',
			fallbackSupportId: 'position',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherPosition: [
						{
							...staticDefinitionParams,
							properties: {
								position: _attributes.publisherPosition.type,
							},
						},
					],
				},
				blockProps
			),
		});

		const positionTop = getValueAddonRealValue(
			_attributes.publisherPosition.position?.top
		);
		if (positionTop !== '') {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherPosition.position.top',
				fallbackSupportId: 'positionTop',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherPositionTop: [
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
			_attributes.publisherPosition.position?.right
		);
		if (positionRight !== '') {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherPosition.position.right',
				fallbackSupportId: 'positionRight',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherPositionRight: [
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
			_attributes.publisherPosition.position?.bottom
		);
		if (positionBottom !== '') {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherPosition.position.bottom',
				fallbackSupportId: 'positionBottom',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherPositionBottom: [
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
			_attributes.publisherPosition.position?.left
		);
		if (positionLeft !== '') {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherPosition.position.left',
				fallbackSupportId: 'positionLeft',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherPositionLeft: [
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

		if (isActiveField(publisherZIndex)) {
			const zIndex = getValueAddonRealValue(_attributes.publisherZIndex);

			if (zIndex !== attributes.publisherZIndex.default) {
				const pickedSelector = getCssSelector({
					...sharedParams,
					query: 'publisherZIndex',
					support: 'publisherZIndex',
					fallbackSupportId: 'zIndex',
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							publisherZIndex: [
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
