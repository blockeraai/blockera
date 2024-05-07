// @flow

/**
 * Blockera dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@blockera/style-engine';
import { getValueAddonRealValue } from '@blockera/editor';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '@blockera/style-engine/js/types';
import {
	GridColumnGenerator,
	GridRowGenerator,
	GridAreaGenerator,
} from './css-generators';

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
		blockeraDisplay,
		blockeraGap,
		blockeraFlexWrap,
		blockeraAlignContent,
		blockeraGridColumns,
		blockeraGridRows,
		blockeraGridAreas,
		blockeraGridGap,
		blockeraGridAlignItems,
		blockeraGridJustifyItems,
		blockeraGridDirection,
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

	if (_attributes.blockeraDisplay === 'grid') {
		if (
			isActiveField(blockeraGridGap) &&
			_attributes.blockeraGridGap !== attributes.blockeraGridGap.default
		) {
			if (_attributes.blockeraGridGap?.lock) {
				const gap = getValueAddonRealValue(
					_attributes.blockeraGridGap?.gap
				);
				if (gap) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'blockeraGridGap',
						support: 'blockeraGridGap',
						fallbackSupportId: 'gap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								blockeraGridGap: [
									{
										...staticDefinitionParams,
										properties: {
											gap: _attributes.blockeraGridGap
												.gap,
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
					_attributes.blockeraGridGap?.rows
				);
				if (rows) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'blockeraGridGap.rows',
						fallbackSupportId: 'rowGap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								blockeraGridGap: [
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
					_attributes.blockeraGridGap?.columns
				);
				if (columns) {
					const pickedSelector = getCssSelector({
						...sharedParams,
						query: 'blockeraGridGap.columns',
						fallbackSupportId: 'columnGap',
					});

					styleGroup.push({
						selector: pickedSelector,
						declarations: computedCssDeclarations(
							{
								blockeraGridGap: [
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

		if (isActiveField(blockeraGridColumns)) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraGridColumns',
				support: 'blockeraGridColumns',
				fallbackSupportId: 'gridColumns',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGridColumns: [
							{
								type: 'function',
								function: GridColumnGenerator,
							},
						],
					},
					blockProps
				),
			});
		}

		if (isActiveField(blockeraGridRows)) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraGridRows',
				support: 'blockeraGridRows',
				fallbackSupportId: 'gridRows',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGridRows: [
							{
								type: 'function',
								function: GridRowGenerator,
							},
						],
					},
					blockProps
				),
			});
		}

		if (
			isActiveField(blockeraGridAreas) &&
			!arrayEquals(
				attributes.blockeraGridAreas.default,
				_attributes.blockeraGridAreas
			)
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraGridAreas',
				support: 'blockeraGridAreas',
				fallbackSupportId: 'gridAreas',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGridAreas: [
							{
								type: 'function',
								function: GridAreaGenerator,
							},
						],
					},
					blockProps
				),
			});
		}

		if (
			isActiveField(blockeraGridAlignItems) &&
			_attributes.blockeraGridAlignItems !==
				attributes.blockeraGridAlignItems.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraGridAlignItems',
				fallbackSupportId: 'gridAlignItems',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGridAlignItems: [
							{
								...staticDefinitionParams,
								properties: {
									'align-items':
										_attributes.blockeraGridAlignItems,
								},
							},
						],
					},
					blockProps
				),
			});
		}

		if (
			isActiveField(blockeraGridJustifyItems) &&
			_attributes.blockeraGridJustifyItems !==
				attributes.blockeraGridJustifyItems.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraGridJustifyItems',
				fallbackSupportId: 'gridJustifyItems',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGridJustifyItems: [
							{
								...staticDefinitionParams,
								properties: {
									'justify-items':
										_attributes.blockeraGridJustifyItems,
								},
							},
						],
					},
					blockProps
				),
			});
		}

		if (
			isActiveField(blockeraGridDirection) &&
			!arrayEquals(
				_attributes.blockeraGridDirection,
				attributes.blockeraGridDirection.default
			)
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraGridDirection',
				fallbackSupportId: 'gridDirection',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGridDirection: [
							{
								...staticDefinitionParams,
								properties: {
									'grid-auto-flow': `${
										_attributes.blockeraGridDirection.value
									} ${
										_attributes.blockeraGridDirection.dense
											? 'dense'
											: ''
									}`,
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
