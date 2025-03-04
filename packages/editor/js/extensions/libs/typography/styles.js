// @flow

/**
 * Blockera dependencies
 */
import { isEmptyObject, isEquals } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import { TextShadowGenerator } from './css-generators';
import type { CssRule } from '../../../style-engine/types';
import {
	computedCssDeclarations,
	getCompatibleBlockCssSelector,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('typography');

export function TypographyStyles({
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
}: StylesProps): Array<CssRule> {
	const {
		blockeraFontFamily,
		blockeraFontAppearance,
		blockeraFontSize,
		blockeraLineHeight,
		blockeraTextAlign,
		blockeraFontColor,
		blockeraTextDecoration,
		blockeraTextShadow,
		blockeraTextTransform,
		blockeraDirection,
		blockeraLetterSpacing,
		blockeraWordSpacing,
		blockeraTextIndent,
		blockeraTextOrientation,
		blockeraTextColumns,
		blockeraTextStroke,
		blockeraWordBreak,
		blockeraTextWrap,
	} = config.typographyConfig;

	const blockProps = {
		state,
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

	const styleGroup: Array<CssRule> = [];

	if (isActiveField(blockeraFontFamily)) {
		const blockeraFontFamily = blockProps.attributes.blockeraFontFamily;

		if (blockeraFontFamily !== attributes.blockeraFontFamily.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFontFamily',
				support: 'blockeraFontFamily',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFontFamily'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFontFamily: [
							{
								type: 'static',
								properties: {
									'font-family': `var(--wp--preset--font-family--${blockeraFontFamily}) !important`,
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

	if (isActiveField(blockeraFontAppearance)) {
		const blockeraFontAppearance =
			blockProps.attributes.blockeraFontAppearance;

		if (
			!isEquals(
				blockeraFontAppearance,
				attributes.blockeraFontAppearance.default
			)
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFontAppearance',
				support: 'blockeraFontAppearance',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFontAppearance'
				),
			});

			const properties: {
				'font-weight'?: string,
				'font-style'?: string,
			} = {};

			if (blockeraFontAppearance.weight !== '') {
				properties['font-weight'] = blockeraFontAppearance.weight;
			}

			if (blockeraFontAppearance.style !== '') {
				properties['font-style'] = blockeraFontAppearance.style;
			}

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFontAppearance: [
							{
								type: 'static',
								properties,
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}
	}

	if (isActiveField(blockeraFontSize)) {
		const blockeraFontSize = getValueAddonRealValue(
			blockProps.attributes.blockeraFontSize
		);

		if (blockeraFontSize !== attributes.blockeraFontSize.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFontSize',
				support: 'blockeraFontSize',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFontSize'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFontSize: [
							{
								type: 'static',
								properties: {
									'font-size':
										blockeraFontSize + ' !important',
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

	if (isActiveField(blockeraLineHeight)) {
		const blockeraLineHeight = getValueAddonRealValue(
			blockProps.attributes.blockeraLineHeight
		);

		if (blockeraLineHeight !== attributes.blockeraLineHeight.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraLineHeight',
				support: 'blockeraLineHeight',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraLineHeight'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraLineHeight: [
							{
								type: 'static',
								properties: {
									'line-height':
										blockeraLineHeight + ' !important',
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

	if (isActiveField(blockeraFontColor)) {
		const blockeraFontColor = getValueAddonRealValue(
			blockProps.attributes.blockeraFontColor
		);

		if (blockeraFontColor !== attributes.blockeraFontColor.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFontColor',
				support: 'blockeraFontColor',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFontColor'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFontColor: [
							{
								type: 'static',
								properties: {
									color: blockeraFontColor,
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

	if (isActiveField(blockeraTextAlign)) {
		const blockeraTextAlign = blockProps.attributes.blockeraTextAlign;

		if (blockeraTextAlign !== attributes.blockeraTextAlign.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTextAlign',
				support: 'blockeraTextAlign',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTextAlign'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextAlign: [
							{
								type: 'static',
								properties: {
									'text-align': blockeraTextAlign,
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

	if (isActiveField(blockeraTextDecoration)) {
		const blockeraTextDecoration =
			blockProps.attributes.blockeraTextDecoration;

		if (
			blockeraTextDecoration !== attributes.blockeraTextDecoration.default
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTextDecoration',
				support: 'blockeraTextDecoration',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTextDecoration'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextDecoration: [
							{
								type: 'static',
								properties: {
									'text-decoration': blockeraTextDecoration,
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

	if (isActiveField(blockeraTextTransform)) {
		const blockeraTextTransform =
			blockProps.attributes.blockeraTextTransform;

		if (
			blockeraTextTransform !== attributes.blockeraTextTransform.default
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTextTransform',
				support: 'blockeraTextTransform',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTextTransform'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextTransform: [
							{
								type: 'static',
								properties: {
									'text-transform': blockeraTextTransform,
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

	if (isActiveField(blockeraDirection)) {
		const blockeraDirection = blockProps.attributes.blockeraDirection;

		if (blockeraDirection !== attributes.blockeraDirection.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraDirection',
				support: 'blockeraDirection',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraDirection'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraDirection: [
							{
								type: 'static',
								properties: {
									direction: blockeraDirection,
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

	if (isActiveField(blockeraLetterSpacing)) {
		const blockeraLetterSpacing =
			blockProps.attributes.blockeraLetterSpacing;

		if (
			blockeraLetterSpacing !== attributes.blockeraLetterSpacing.default
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraLetterSpacing',
				support: 'blockeraLetterSpacing',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraLetterSpacing'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraLetterSpacing: [
							{
								type: 'static',
								properties: {
									'letter-spacing': blockeraLetterSpacing,
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

	if (isActiveField(blockeraWordSpacing)) {
		const blockeraWordSpacing = blockProps.attributes.blockeraWordSpacing;

		if (blockeraWordSpacing !== attributes.blockeraWordSpacing.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraWordSpacing',
				support: 'blockeraWordSpacing',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraWordSpacing'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraWordSpacing: [
							{
								type: 'static',
								properties: {
									'word-spacing': blockeraWordSpacing,
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

	if (isActiveField(blockeraTextIndent)) {
		const blockeraTextIndent = blockProps.attributes.blockeraTextIndent;

		if (blockeraTextIndent !== attributes.blockeraTextIndent.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTextIndent',
				support: 'blockeraTextIndent',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTextIndent'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextIndent: [
							{
								type: 'static',
								properties: {
									'text-indent': blockeraTextIndent,
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

	if (isActiveField(blockeraTextOrientation)) {
		const blockeraTextOrientation =
			blockProps.attributes.blockeraTextOrientation;

		if (
			blockeraTextOrientation !==
			attributes.blockeraTextOrientation.default
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTextOrientation',
				support: 'blockeraTextOrientation',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTextOrientation'
				),
			});

			const properties: {
				'writing-mode'?: string,
				'text-orientation'?: string,
			} = {};

			switch (blockeraTextOrientation) {
				case 'style-1':
					properties['writing-mode'] = 'vertical-lr' + ' !important';
					properties['text-orientation'] = 'mixed' + ' !important';
					break;
				case 'style-2':
					properties['writing-mode'] = 'vertical-rl' + ' !important';
					properties['text-orientation'] = 'mixed' + ' !important';
					break;
				case 'style-3':
					properties['writing-mode'] = 'vertical-lr' + ' !important';
					properties['text-orientation'] = 'upright' + ' !important';
					break;
				case 'style-4':
					properties['writing-mode'] = 'vertical-rl' + ' !important';
					properties['text-orientation'] = 'upright' + ' !important';
					break;
				case 'initial':
					properties['writing-mode'] =
						'horizontal-tb' + ' !important';
					properties['text-orientation'] = 'mixed' + ' !important';
			}

			if (!isEmptyObject(properties))
				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraTextOrientation: [
								{
									type: 'static',
									properties,
								},
							],
						},
						blockProps,
						pickedSelector
					),
				});
		}
	}

	if (isActiveField(blockeraTextColumns)) {
		const blockeraTextColumns = blockProps.attributes.blockeraTextColumns;

		if (
			!isEquals(
				blockeraTextColumns,
				attributes.blockeraTextColumns.default
			)
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTextColumns',
				support: 'blockeraTextColumns',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTextColumns'
				),
			});

			const properties: {
				'column-count'?: string,
				'column-gap'?: string,
				'column-rule-color'?: string,
				'column-rule-width'?: string,
				'column-rule-style'?: string,
			} = {};

			properties['column-count'] = blockeraTextColumns.columns
				.replace('-columns', '')
				.replace('none', 'initial');

			if (properties['column-count'] !== 'initial') {
				const gap = getValueAddonRealValue(blockeraTextColumns.gap);

				if (gap !== '') {
					properties['column-gap'] = gap;
				}

				if (
					blockeraTextColumns?.divider?.width !== undefined &&
					blockeraTextColumns?.divider?.width !== ''
				) {
					const color = getValueAddonRealValue(
						blockeraTextColumns?.divider?.color
					);

					if (color !== '') {
						properties['column-rule-color'] = color;
					}

					properties['column-rule-width'] =
						blockeraTextColumns.divider.width;

					properties['column-rule-style'] =
						blockeraTextColumns.divider.style || 'solid';
				}
			}

			if (!isEmptyObject(properties))
				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraTextColumns: [
								{
									type: 'static',
									properties,
								},
							],
						},
						blockProps,
						pickedSelector
					),
				});
		}
	}

	if (isActiveField(blockeraTextStroke)) {
		const blockeraTextStroke = blockProps.attributes.blockeraTextStroke;

		if (blockeraTextStroke !== attributes.blockeraTextStroke.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTextStroke',
				support: 'blockeraTextStroke',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTextStroke'
				),
			});

			const textStrokeColor = getValueAddonRealValue(
				blockeraTextStroke?.color
			);

			if (textStrokeColor !== '') {
				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraTextStroke: [
								{
									type: 'static',
									properties: {
										'-webkit-text-stroke':
											blockeraTextStroke?.width +
											' ' +
											textStrokeColor,
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

	if (isActiveField(blockeraWordBreak)) {
		const blockeraWordBreak = blockProps.attributes.blockeraWordBreak;

		if (
			blockeraWordBreak !== attributes.blockeraWordBreak.default &&
			blockeraWordBreak !== 'normal'
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraWordBreak',
				support: 'blockeraWordBreak',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraWordBreak'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraWordBreak: [
							{
								type: 'static',
								properties: {
									'word-break': blockeraWordBreak,
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

	if (isActiveField(blockeraTextWrap)) {
		const blockeraTextWrap = blockProps.attributes.blockeraTextWrap;

		if (blockeraTextWrap !== attributes.blockeraTextWrap.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraTextWrap',
				support: 'blockeraTextWrap',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraTextWrap'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextWrap: [
							{
								type: 'static',
								properties: {
									'text-wrap': blockeraTextWrap,
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

	if (
		isActiveField(blockeraTextShadow) &&
		!arrayEquals(
			attributes.blockeraTextShadow.default,
			blockProps.attributes.blockeraTextShadow
		)
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraTextShadow',
			support: 'blockeraTextShadow',
			fallbackSupportId: getBlockSupportFallback(
				getBlockSupportCategory('textShadow'),
				'blockeraTextShadow'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraTextShadow: [
						{
							type: 'function',
							function: TextShadowGenerator,
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	return styleGroup;
}
