// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';
import { isEquals } from '@blockera/utils';
import { STORE_NAME as EXTENSIONS_CONFIG_STORE_NAME } from '@blockera/editor/js/extensions/libs/base/store/constants';
import type { CssRule } from '@blockera/editor/js/style-engine/types';
import { isActiveField } from '@blockera/editor/js/extensions/api/utils';
import type { StylesProps } from '@blockera/editor/js/extensions/libs/types';
import { getBlockSupportFallback } from '@blockera/editor/js/extensions/utils';
import { computedCssDeclarations } from '@blockera/editor/js/style-engine/utils';
import { getCompatibleBlockCssSelector } from '@blockera/editor/js/style-engine/get-compatible-block-css-selector';

import { prepareIconSvgForStorage } from '@blockera/icons';

import {
	DEFAULT_ICON_COLOR_ATTRIBUTE,
	DEFAULT_ICON_SIZE_ATTRIBUTE,
	getIconColorAttributeId,
	getIconSizeAttributeId,
} from '../helpers';
import {
	getBlockeraIconValue,
	getClassNameFromAttributes,
	getCustomIconSvgSource,
	decodeRenderedIcon,
	isCustomUploadedIcon,
	svgHasPreservedColors,
} from '../icon-attribute-utils';

export const IconStyles = ({
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
	const {
		blockeraIcon,
		// blockeraIconPosition,
		blockeraIconGap,
		blockeraIconSize,
		blockeraIconColor,
		blockeraIconRotate,
		blockeraIconFlipHorizontal,
		blockeraIconFlipVertical,
		// blockeraIconLink,
	} = config.iconConfig;
	const { getExtension } = select(EXTENSIONS_CONFIG_STORE_NAME) || {};
	const registeredIconConfig =
		'function' === typeof getExtension
			? getExtension('iconConfig', blockName)
			: null;
	const blockProps = {
		state,
		attributes: currentBlockAttributes,
		clientId,
		blockName,
		currentBlock,
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
		supports: blockSupports,
		className: currentBlockAttributes?.className,
	};
	const styleGroup: Array<CssRule> = [];
	const staticDefinitionParams = {
		type: 'static',
		options: {
			important: true,
		},
	};

	if (
		isActiveField(blockeraIcon) &&
		!isEquals(
			currentBlockAttributes.blockeraIcon,
			attributes.blockeraIcon.default
		)
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraIcon',
			support: 'blockeraIcon',
			fallbackSupportId: getBlockSupportFallback(
				blockSupports,
				'blockeraIcon'
			),
		});

		const iconValue = getBlockeraIconValue({
			blockeraIcon: currentBlockAttributes.blockeraIcon,
		});
		const isCustomIcon = isCustomUploadedIcon(iconValue);
		const className = getClassNameFromAttributes(currentBlockAttributes);
		const isIconBlockVariation =
			className.includes('wp-block-icon-blockera') ||
			blockName === 'core/icon';
		const svgForCssUrl = isCustomIcon
			? getCustomIconSvgSource(iconValue)
			: prepareIconSvgForStorage(
					getCustomIconSvgSource(iconValue) ||
						decodeRenderedIcon(iconValue?.renderedIcon),
					iconValue?.library || ''
				);
		const hasPreservedColors = svgHasPreservedColors(svgForCssUrl);

		// Standalone icon blocks render inline SVG, not CSS mask.
		if (!isIconBlockVariation) {
			const iconUrlValue = `url("data:image/svg+xml,${encodeURIComponent(
				svgForCssUrl
			)}")`;
			// Keep --url as the single SVG payload; mask/bg reference it (no duplicated data URL).
			const iconUrlProperties = hasPreservedColors
				? {
						'--blockera--icon--url': iconUrlValue,
						// Editor canvas: render full-color SVG via background-image, not mask.
						'--blockera--icon--bg-image':
							'var(--blockera--icon--url)',
						'--blockera--icon--mask-image': 'none',
						'--blockera--icon--editor-icon-bg': 'transparent',
					}
				: {
						'--blockera--icon--url': iconUrlValue,
						// Reset inherited multi-color vars from ancestor list blocks.
						'--blockera--icon--bg-image': 'none',
						'--blockera--icon--mask-image':
							'var(--blockera--icon--url)',
						'--blockera--icon--editor-icon-bg':
							'var(--blockera--icon--color, currentColor)',
					};

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraIcon: [
							{
								...staticDefinitionParams,
								properties: iconUrlProperties,
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}
	}

	const iconSizeAttributeId = getIconSizeAttributeId(
		registeredIconConfig?.blockeraIconSize || blockeraIconSize
	);
	const iconColorAttributeId = getIconColorAttributeId(
		registeredIconConfig?.blockeraIconColor || blockeraIconColor
	);

	// When size maps to another attribute (e.g. blockeraWidth on core/icon), the size extension owns CSS.
	if (
		iconSizeAttributeId === DEFAULT_ICON_SIZE_ATTRIBUTE &&
		isActiveField(blockeraIconSize) &&
		currentBlockAttributes.blockeraIconSize !==
			attributes.blockeraIconSize.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraIconSize',
			support: 'blockeraIconSize',
			fallbackSupportId: getBlockSupportFallback(
				blockSupports,
				'blockeraIconSize'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraIconSize: [
						{
							...staticDefinitionParams,
							properties: {
								'--blockera--icon--size':
									currentBlockAttributes.blockeraIconSize,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		isActiveField(blockeraIconGap) &&
		currentBlockAttributes.blockeraIconGap !==
			attributes.blockeraIconGap.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraIconGap',
			support: 'blockeraIconGap',
			fallbackSupportId: getBlockSupportFallback(
				blockSupports,
				'blockeraIconGap'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraIconGap: [
						{
							...staticDefinitionParams,
							properties: {
								'--blockera--icon--gap':
									currentBlockAttributes.blockeraIconGap,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	// When color maps to another attribute (e.g. blockeraFontColor on core/icon), typography owns CSS.
	if (iconColorAttributeId === DEFAULT_ICON_COLOR_ATTRIBUTE) {
		const resolvedIconColor = getValueAddonRealValue(
			currentBlockAttributes.blockeraIconColor,
			{ blockName }
		);
		const defaultIconColor = getValueAddonRealValue(
			attributes.blockeraIconColor.default,
			{ blockName }
		);

		if (
			isActiveField(blockeraIconColor) &&
			resolvedIconColor !== defaultIconColor
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraIconColor',
				support: 'blockeraIconColor',
				fallbackSupportId: getBlockSupportFallback(
					blockSupports,
					'blockeraIconColor'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraIconColor: [
							{
								...staticDefinitionParams,
								properties: {
									'--blockera--icon--color':
										resolvedIconColor,
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
		isActiveField(blockeraIconRotate) &&
		currentBlockAttributes.blockeraIconRotate !==
			attributes.blockeraIconRotate.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraIconRotate',
			support: 'blockeraIconRotate',
			fallbackSupportId: getBlockSupportFallback(
				blockSupports,
				'blockeraIconRotate'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraIconRotate: [
						{
							...staticDefinitionParams,
							properties: {
								'--blockera--icon--rotate':
									currentBlockAttributes.blockeraIconRotate +
									'deg',
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		isActiveField(blockeraIconFlipHorizontal) &&
		currentBlockAttributes.blockeraIconFlipHorizontal !==
			attributes.blockeraIconFlipHorizontal.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraIconFlipHorizontal',
			support: 'blockeraIconFlipHorizontal',
			fallbackSupportId: getBlockSupportFallback(
				blockSupports,
				'blockeraIconFlipHorizontal'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraIconFlipHorizontal: [
						{
							...staticDefinitionParams,
							properties: {
								'--blockera--icon--flip-horizontal': '-1',
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		isActiveField(blockeraIconFlipVertical) &&
		currentBlockAttributes.blockeraIconFlipVertical !==
			attributes.blockeraIconFlipVertical.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraIconFlipVertical',
			support: 'blockeraIconFlipVertical',
			fallbackSupportId: getBlockSupportFallback(
				blockSupports,
				'blockeraIconFlipVertical'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraIconFlipVertical: [
						{
							...staticDefinitionParams,
							properties: {
								'--blockera--icon--flip-vertical': '-1',
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	return styleGroup;
};
