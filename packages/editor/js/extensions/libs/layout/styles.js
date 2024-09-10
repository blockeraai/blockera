// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';
import { prepare } from '@blockera/data-editor';

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

const supports = getBlockSupportCategory('layout');

export const LayoutStyles = ({
	state,
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	styleEngineConfig,
	selectors: blockSelectors,
	defaultAttributes: attributes,
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

	if (isActiveField(blockeraDisplay) && _attributes.blockeraDisplay !== '') {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraDisplay',
			support: 'blockeraDisplay',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraDisplay'
			),
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

	if (
		_attributes.blockeraDisplay === 'flex' &&
		_attributes?.blockeraFlexLayout !== undefined
	) {
		if (_attributes?.blockeraFlexLayout?.direction) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFlexLayout.direction',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFlexLayout'
				),
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFlexLayout.alignItems',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFlexLayout'
				),
			});

			const alignProp: string =
				_attributes?.blockeraFlexLayout?.direction === 'column'
					? 'justify-content'
					: 'align-items';

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFlexLayout: [
							{
								...staticDefinitionParams,
								properties: {
									[alignProp]:
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFlexLayout.justifyContent',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFlexLayout'
				),
			});

			const justifyProp: string =
				_attributes?.blockeraFlexLayout?.direction === 'column'
					? 'align-items'
					: 'justify-content';

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFlexLayout: [
							{
								...staticDefinitionParams,
								properties: {
									[justifyProp]:
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
		_attributes.blockeraDisplay === 'flex' &&
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

		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraFlexWrap',
			support: 'blockeraFlexWrap',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraFlexWrap'
			),
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
		_attributes.blockeraDisplay === 'flex' &&
		isActiveField(blockeraAlignContent) &&
		_attributes.blockeraAlignContent !==
			attributes.blockeraAlignContent.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraAlignContent',
			support: 'blockeraAlignContent',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraAlignContent'
			),
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

	/**
	 * Gap styles
	 */
	if (
		isActiveField(blockeraGap) &&
		_attributes.blockeraGap !== attributes.blockeraGap.default
	) {
		let gapSuffixClass = '';

		// Flag for removing `margin-block-start` if needed
		let removeMarginBlockStart = false;

		// Detect gap type for block
		const gapType = prepare('gap-type', styleEngineConfig);

		switch (gapType) {
			case 'margin':
				gapSuffixClass = '> * + *';
				break;

			case 'gap-and-margin':
				if (!['flex', 'grid'].includes(_attributes.blockeraDisplay)) {
					gapSuffixClass = '> * + *';
				}
				break;
		}

		if (_attributes.blockeraGap?.lock) {
			const gap = getValueAddonRealValue(_attributes.blockeraGap?.gap);

			// gap
			if (gap) {
				const pickedSelector = getCompatibleBlockCssSelector({
					...sharedParams,
					query: 'blockeraGap',
					support: 'blockeraGap',
					fallbackSupportId: getBlockSupportFallback(
						supports,
						'blockeraGap'
					),
					...(gapSuffixClass ? { suffixClass: gapSuffixClass } : {}),
				});

				const gapProperty: string = gapSuffixClass
					? 'margin-block-start'
					: 'gap';

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraGap: [
								{
									...staticDefinitionParams,
									properties: {
										[gapProperty]: gap,
									},
								},
							],
						},
						blockProps
					),
				});

				/**
				 * If gap type is `gap-and-margin` and the current display is flex or grid
				 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
				 */
				if (
					gapType === 'gap-and-margin' &&
					['flex', 'grid'].includes(_attributes.blockeraDisplay)
				) {
					removeMarginBlockStart = true;
				}
			}
		} else {
			/**
			 * Rows gap
			 */
			const rows = getValueAddonRealValue(_attributes.blockeraGap?.rows);

			if (rows) {
				const pickedSelector = getCompatibleBlockCssSelector({
					...sharedParams,
					query: 'blockeraGap.rows',
					fallbackSupportId: getBlockSupportFallback(
						supports,
						'blockeraGap'
					),
					...(gapSuffixClass ? { suffixClass: gapSuffixClass } : {}),
				});

				const rowsProperty: string = gapSuffixClass
					? 'margin-block-start'
					: 'row-gap';

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraGap: [
								{
									...staticDefinitionParams,
									properties: {
										[rowsProperty]: rows,
									},
								},
							],
						},
						blockProps
					),
				});

				/**
				 * If gap type is `gap-and-margin` and the current display is flex or grid
				 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
				 */
				if (
					gapType === 'gap-and-margin' &&
					['flex', 'grid'].includes(_attributes.blockeraDisplay)
				) {
					removeMarginBlockStart = true;
				}
			}

			/**
			 * Columns gap
			 */
			const columns = getValueAddonRealValue(
				_attributes.blockeraGap?.columns
			);

			// if there is gapSuffixClass it means the gap is by margin that that does not supports columns gap
			if (columns && !gapSuffixClass) {
				const pickedSelector = getCompatibleBlockCssSelector({
					...sharedParams,
					query: 'blockeraGap.columns',
					fallbackSupportId: getBlockSupportFallback(
						supports,
						'blockeraGap'
					),
					...(gapSuffixClass ? { suffixClass: gapSuffixClass } : {}),
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

		/**
		 * If gap type is both and the current display is flex or grid
		 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
		 *
		 * This variable is false by default but it will be enabled if the style clearing is needed.
		 */
		if (removeMarginBlockStart) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraGap',
				support: 'blockeraGap',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraGap'
				),
				suffixClass: '> * + *',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGap: [
							{
								...staticDefinitionParams,
								properties: {
									'margin-block-start': '0',
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
