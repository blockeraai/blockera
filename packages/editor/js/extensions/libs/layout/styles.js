// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import { getCssSelector, computedCssDeclarations } from '../../../style-engine';

export const LayoutStyles = ({
	state,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const {
		blockeraDisplay,
		blockeraGap,
		blockeraFlexWrap,
		blockeraAlignContent,
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

	if (
		isActiveField(blockeraDisplay) &&
		_attributes.blockeraDisplay !== attributes.blockeraDisplay.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraDisplay',
			support: 'blockeraDisplay',
			fallbackSupportId: 'display',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraDisplay: [
						{
							...staticDefinitionParams,
							properties: {
								display: _attributes.blockeraDisplay,
							},
						},
					],
				},
				blockProps
			),
		});
	}

	if (_attributes.blockeraDisplay === 'flex') {
		if (_attributes?.blockeraFlexLayout !== undefined) {
			if (_attributes?.blockeraFlexLayout?.direction) {
				const pickedSelector = getCssSelector({
					...sharedParams,
					query: 'blockeraFlexLayout.direction',
					fallbackSupportId: 'flexDirection',
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraFlexLayout: [
								{
									...staticDefinitionParams,
									properties: {
										'flex-direction':
											_attributes.blockeraFlexLayout
												.direction,
									},
								},
							],
						},
						blockProps
					),
				});
			}

			if (_attributes?.blockeraFlexLayout?.alignItems) {
				const pickedSelector = getCssSelector({
					...sharedParams,
					query: 'blockeraFlexLayout.alignItems',
					fallbackSupportId: 'alignItems',
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraFlexLayout: [
								{
									...staticDefinitionParams,
									properties: {
										'align-items':
											_attributes.blockeraFlexLayout
												.alignItems,
									},
								},
							],
						},
						blockProps
					),
				});
			}

			if (_attributes?.blockeraFlexLayout?.justifyContent) {
				const pickedSelector = getCssSelector({
					...sharedParams,
					query: 'blockeraFlexLayout.justifyContent',
					fallbackSupportId: 'justifyContent',
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraFlexLayout: [
								{
									...staticDefinitionParams,
									properties: {
										'justify-content':
											_attributes.blockeraFlexLayout
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
			isActiveField(blockeraGap) &&
			_attributes.blockeraGap !== attributes.blockeraGap.default
		) {
			if (_attributes.blockeraGap?.lock) {
				const gap = getValueAddonRealValue(
					_attributes.blockeraGap?.gap
				);
				if (gap) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'blockeraGap',
						support: 'blockeraGap',
						fallbackSupportId: 'gap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								blockeraGap: [
									{
										...staticDefinitionParams,
										properties: {
											gap: _attributes.blockeraGap.gap,
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
					_attributes.blockeraGap?.rows
				);
				if (rows) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'blockeraGap.rows',
						fallbackSupportId: 'rowGap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								blockeraGap: [
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
					_attributes.blockeraGap?.columns
				);
				if (columns) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'blockeraGap.columns',
						fallbackSupportId: 'columnGap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								blockeraGap: [
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
			isActiveField(blockeraFlexWrap) &&
			_attributes.blockeraFlexWrap !== attributes.blockeraFlexWrap.default
		) {
			let value = _attributes.blockeraFlexWrap?.value;

			if (
				_attributes.blockeraFlexWrap?.value === 'wrap' &&
				_attributes.blockeraFlexWrap?.reverse
			) {
				value += '-reverse';
			}

			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraFlexWrap',
				support: 'blockeraFlexWrap',
				fallbackSupportId: 'flexWrap',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFlexWrap: [
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
			isActiveField(blockeraAlignContent) &&
			_attributes.blockeraAlignContent !==
				attributes.blockeraAlignContent.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraAlignContent',
				support: 'blockeraAlignContent',
				fallbackSupportId: 'alignContent',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraAlignContent: [
							{
								...staticDefinitionParams,
								properties: {
									'align-content':
										_attributes.blockeraAlignContent,
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
