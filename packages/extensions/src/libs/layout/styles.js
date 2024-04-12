// @flow

/**
 * Publisher dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '@publisher/style-engine/src/types';

export const LayoutStyles = ({
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
		publisherDisplay,
		publisherGap,
		publisherFlexWrap,
		publisherAlignContent,
	} = config.layoutConfig;
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
		isActiveField(publisherDisplay) &&
		_attributes.publisherDisplay !== attributes.publisherDisplay.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherDisplay',
			support: 'publisherDisplay',
			fallbackSupportId: 'display',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherDisplay: [
						{
							...staticDefinitionParams,
							properties: {
								display: _attributes.publisherDisplay,
							},
						},
					],
				},
				blockProps
			),
		});
	}

	if (_attributes.publisherDisplay === 'flex') {
		if (_attributes?.publisherFlexLayout !== undefined) {
			if (_attributes?.publisherFlexLayout?.direction) {
				const pickedSelector = getCssSelector({
					...sharedParams,
					query: 'publisherFlexLayout.direction',
					fallbackSupportId: 'flexDirection',
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							publisherFlexLayout: [
								{
									...staticDefinitionParams,
									properties: {
										'flex-direction':
											_attributes.publisherFlexLayout
												.direction,
									},
								},
							],
						},
						blockProps
					),
				});
			}

			if (_attributes?.publisherFlexLayout?.alignItems) {
				const pickedSelector = getCssSelector({
					...sharedParams,
					query: 'publisherFlexLayout.alignItems',
					fallbackSupportId: 'alignItems',
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							publisherFlexLayout: [
								{
									...staticDefinitionParams,
									properties: {
										'align-items':
											_attributes.publisherFlexLayout
												.alignItems,
									},
								},
							],
						},
						blockProps
					),
				});
			}

			if (_attributes?.publisherFlexLayout?.justifyContent) {
				const pickedSelector = getCssSelector({
					...sharedParams,
					query: 'publisherFlexLayout.justifyContent',
					fallbackSupportId: 'justifyContent',
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							publisherFlexLayout: [
								{
									...staticDefinitionParams,
									properties: {
										'justify-content':
											_attributes.publisherFlexLayout
												.justifyContent,
									},
								},
							],
						},
						blockProps
					),
				});
			}
		}

		if (
			isActiveField(publisherGap) &&
			_attributes.publisherGap !== attributes.publisherGap.default
		) {
			if (_attributes.publisherGap?.lock) {
				const gap = getValueAddonRealValue(
					_attributes.publisherGap?.gap
				);
				if (gap) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'publisherGap',
						support: 'publisherGap',
						fallbackSupportId: 'gap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								publisherGap: [
									{
										...staticDefinitionParams,
										properties: {
											gap: _attributes.publisherGap.gap,
										},
									},
								],
							},
							blockProps
						),
					});
				}
			} else {
				const rows = getValueAddonRealValue(
					_attributes.publisherGap?.rows
				);
				if (rows) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'publisherGap.rows',
						fallbackSupportId: 'rowGap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								publisherGap: [
									{
										...staticDefinitionParams,
										properties: {
											'row-gap': rows,
										},
									},
								],
							},
							blockProps
						),
					});
				}

				const columns = getValueAddonRealValue(
					_attributes.publisherGap?.columns
				);
				if (columns) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'publisherGap.columns',
						fallbackSupportId: 'columnGap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								publisherGap: [
									{
										...staticDefinitionParams,
										properties: {
											'column-gap': columns,
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

		if (
			isActiveField(publisherFlexWrap) &&
			_attributes.publisherFlexWrap !==
				attributes.publisherFlexWrap.default
		) {
			let value = _attributes.publisherFlexWrap?.value;

			if (
				_attributes.publisherFlexWrap?.value === 'wrap' &&
				_attributes.publisherFlexWrap?.reverse
			) {
				value += '-reverse';
			}

			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherFlexWrap',
				support: 'publisherFlexWrap',
				fallbackSupportId: 'flexWrap',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherFlexWrap: [
							{
								...staticDefinitionParams,
								properties: {
									'flex-wrap': value,
								},
							},
						],
					},
					blockProps
				),
			});
		}

		if (
			isActiveField(publisherAlignContent) &&
			_attributes.publisherAlignContent !==
				attributes.publisherAlignContent.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherAlignContent',
				support: 'publisherAlignContent',
				fallbackSupportId: 'alignContent',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherAlignContent: [
							{
								...staticDefinitionParams,
								properties: {
									'align-content':
										_attributes.publisherAlignContent,
								},
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
