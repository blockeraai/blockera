// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useState, useEffect, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { useLateEffect } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { useStateChanges } from './use-state-changes';
import {
	useStylesForBlocks,
	getDefaultStyle,
	getActiveStyle,
} from '../../editor/global-styles/panel/ui/utils';
import { getBlockeraGlobalStylesMetaData } from '../../editor/global-styles/helpers';
import { useGlobalStylesPanelContext } from '../../editor/global-styles/panel/context';
import { type T_SET_CURRENT_ACTIVE_STYLE } from '../../editor/global-styles/panel/ui/types';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../../editor/global-styles/panel/variation-surfaces';
import {
	filterRenderedStylesExcludingSizes,
	getThemeVariationConfigsFromCoreStore,
	mergeBlockVariationsTrees,
} from '../../editor/global-styles/variation-filters';
import { useSizeVariationsForBlocks } from './use-size-variations-for-blocks';

export const useBlockStyleVariations = ({
	clientId,
	blockName,
	storedAttributes,
	defaultAttributes,
	inGlobalStylesPanel = false,
	variationSurface: variationSurfaceProp,
}: {
	clientId: string,
	blockName: string,
	storedAttributes: Object,
	defaultAttributes: Object,
	inGlobalStylesPanel?: boolean,
	variationSurface?: string,
}): Object => {
	const {
		currentBlockStyleVariation,
		variationSurface: contextVariationSurface = VARIATION_SURFACE_STYLE,
		baseConfig,
		userConfig,
	} = useGlobalStylesPanelContext();
	const variationSurface = variationSurfaceProp ?? contextVariationSurface;

	const inspectorThemeConfigs = useSelect(
		(select: Function) =>
			inGlobalStylesPanel
				? { baseConfig: {}, userConfig: {} }
				: getThemeVariationConfigsFromCoreStore(select),
		[inGlobalStylesPanel]
	);

	const effectiveBase = useMemo(
		() =>
			inGlobalStylesPanel
				? baseConfig || {}
				: inspectorThemeConfigs.baseConfig,
		[inGlobalStylesPanel, baseConfig, inspectorThemeConfigs]
	);
	const effectiveUser = useMemo(
		() =>
			inGlobalStylesPanel
				? userConfig || {}
				: inspectorThemeConfigs.userConfig,
		[inGlobalStylesPanel, userConfig, inspectorThemeConfigs]
	);

	const mergedVariations = useMemo(
		() =>
			mergeBlockVariationsTrees(effectiveBase, effectiveUser, blockName),
		[effectiveBase, effectiveUser, blockName]
	);

	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const [event, setEvent] = useState('click');
	const onSwitch = useCallback(() => {}, []);

	const stylesFromWp = useStylesForBlocks({
		event,
		clientId,
		blockName,
		onSwitch,
		inGlobalStylesPanel,
	});

	const stylesFromWpAdjusted = useMemo(() => {
		const filtered = filterRenderedStylesExcludingSizes(
			stylesFromWp.stylesToRender,
			mergedVariations
		);
		const list =
			filtered.length > 0 ? filtered : stylesFromWp.stylesToRender;
		const active = getActiveStyle(list, stylesFromWp.className);
		const deleted = typeof active === 'string' ? active : false;
		return {
			...stylesFromWp,
			stylesToRender: list,
			activeStyle: deleted ? getDefaultStyle(list) : active,
			isDeletedStyle: deleted,
		};
	}, [stylesFromWp, mergedVariations]);

	const stylesFromSize = useSizeVariationsForBlocks({
		enabled: variationSurface === VARIATION_SURFACE_SIZE,
		clientId,
		blockName,
		mergedVariationsBySlug: mergedVariations,
		inGlobalStylesPanel,
		inspectorApplyClassName:
			!inGlobalStylesPanel && variationSurface === VARIATION_SURFACE_SIZE,
		event,
	});

	const {
		onSelect,
		activeStyle,
		isDeletedStyle,
		stylesToRender,
		genericPreviewBlock,
		className: previewClassName,
	} = variationSurface === VARIATION_SURFACE_SIZE
		? stylesFromSize
		: stylesFromWpAdjusted;

	const [currentActiveStyle, _setCurrentActiveStyle] = useState(activeStyle);
	const callbackActivatorStyle: T_SET_CURRENT_ACTIVE_STYLE = (
		style,
		event
	) => {
		setEvent(event);
		_setCurrentActiveStyle(style);
	};
	const setCurrentActiveStyle = useCallback(callbackActivatorStyle, []);
	const [currentPreviewStyle, setCurrentPreviewStyle] = useState(null);

	useEffect(() => {
		if (variationSurface === VARIATION_SURFACE_SIZE) {
			const hookName = activeStyle?.name ?? '';
			const curName = currentActiveStyle?.name ?? '';
			if (hookName !== curName) {
				_setCurrentActiveStyle(activeStyle ?? null);
			}

			return;
		}

		if (
			undefined === currentBlockStyleVariation &&
			currentActiveStyle &&
			!currentActiveStyle.isDefault
		) {
			setCurrentActiveStyle(getDefaultStyle(stylesToRender));
		}

		if (
			currentBlockStyleVariation?.name &&
			currentActiveStyle?.name &&
			currentBlockStyleVariation?.name !== currentActiveStyle?.name
		) {
			setCurrentActiveStyle(currentBlockStyleVariation);
		}
	}, [
		variationSurface,
		stylesToRender,
		activeStyle,
		currentActiveStyle,
		setCurrentActiveStyle,
		currentBlockStyleVariation,
	]);

	// Update cached style when active style changes
	useLateEffect(() => {
		if (
			currentPreviewStyle === null &&
			activeStyle?.name &&
			currentActiveStyle?.name &&
			activeStyle?.name !== currentActiveStyle?.name
		) {
			onSelect(currentActiveStyle);
		}
	}, [currentPreviewStyle]);

	const blockeraGlobalStylesMetaData = getBlockeraGlobalStylesMetaData();

	const buttonText = useMemo(() => {
		if (isDeletedStyle) {
			return variationSurface === VARIATION_SURFACE_SIZE
				? __('Missing Size Variation', 'blockera')
				: __('Missing Style Variation', 'blockera');
		}

		if (
			variationSurface === VARIATION_SURFACE_SIZE &&
			!currentActiveStyle?.name
		) {
			return __('Size variations', 'blockera');
		}

		return (
			blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations?.[
				currentActiveStyle?.name
			]?.label ||
			currentActiveStyle?.label ||
			currentActiveStyle?.name ||
			__('Default', 'blockera')
		);
	}, [
		blockName,
		isDeletedStyle,
		currentActiveStyle,
		blockeraGlobalStylesMetaData,
		variationSurface,
	]);

	const memoizedStyles = useMemo(
		() => ({
			onSelect,
			stylesToRender,
			genericPreviewBlock,
			activeStyle: currentActiveStyle,
			setCurrentActiveStyle,
			setCurrentPreviewStyle,
			previewClassName,
			popoverAnchor,
			setIsOpen,
		}),
		[
			onSelect,
			stylesToRender,
			genericPreviewBlock,
			currentActiveStyle,
			setCurrentActiveStyle,
			setCurrentPreviewStyle,
			previewClassName,
			popoverAnchor,
			setIsOpen,
		]
	);

	const { hasChangesets, setChangesets, originDefaultAttributes } =
		useStateChanges({
			blockName,
			storedAttributes,
			defaultAttributes,
			currentBlockStyleVariation,
			variationSurface,
		});

	return {
		isOpen,
		event,
		setEvent,
		onSelect,
		setIsOpen,
		isHovered,
		buttonText,
		activeStyle,
		setIsHovered,
		hasChangesets,
		popoverAnchor,
		setChangesets,
		memoizedStyles,
		isDeletedStyle,
		stylesToRender,
		previewClassName,
		setPopoverAnchor,
		currentActiveStyle,
		genericPreviewBlock,
		currentPreviewStyle,
		setCurrentActiveStyle,
		setCurrentPreviewStyle,
		originDefaultAttributes,
		currentBlockStyleVariation,
		blockeraGlobalStylesMetaData,
	};
};
