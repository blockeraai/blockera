// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useMemo,
	useState,
	useEffect,
	useCallback,
	useRef,
} from '@wordpress/element';
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
import {
	alignStyleRowsWithSharedRootVariation,
	getBlockSizeVariationsOrder,
} from '../../editor/global-styles/panel/size-variations';
import {
	getStoredVariationOrder,
	sortVariationRowsBySlugOrder,
} from '../../editor/global-styles/panel/variation-order';
import {
	blockUsesSharedRootStyleVariation,
	getBlockVariationSupport,
} from '../../editor/global-styles/panel/block-variation-support';
import { STORE_NAME as EXTENSIONS_STORE_NAME } from '../../extensions/store/constants';
import { useSizeVariationsForBlocks } from './use-size-variations-for-blocks';

const noop = () => {};

const DISABLED_BLOCK_STYLE_VARIATIONS_PROPS = {
	isOpen: false,
	event: 'click',
	setEvent: noop,
	onSelect: noop,
	setIsOpen: noop,
	isHovered: false,
	buttonText: '',
	activeStyle: null,
	setIsHovered: noop,
	hasChangesets: false,
	popoverAnchor: null,
	setChangesets: noop,
	memoizedStyles: {
		onSelect: noop,
		stylesToRender: [],
		genericPreviewBlock: null,
		activeStyle: null,
		setCurrentActiveStyle: noop,
		setCurrentPreviewStyle: noop,
		previewClassName: '',
		popoverAnchor: null,
		setIsOpen: noop,
	},
	isDeletedStyle: false,
	stylesToRender: [],
	previewClassName: '',
	setPopoverAnchor: noop,
	currentActiveStyle: null,
	genericPreviewBlock: null,
	currentPreviewStyle: null,
	setCurrentActiveStyle: noop,
	setCurrentPreviewStyle: noop,
	originDefaultAttributes: {},
	currentBlockStyleVariation: undefined,
	blockeraGlobalStylesMetaData: {},
};

export const useBlockStyleVariations = ({
	clientId,
	blockName,
	storedAttributes,
	defaultAttributes,
	inGlobalStylesPanel = false,
	variationSurface: variationSurfaceProp,
	enabled = true,
}: {
	clientId: string,
	blockName: string,
	storedAttributes: Object,
	defaultAttributes: Object,
	inGlobalStylesPanel?: boolean,
	variationSurface?: string,
	enabled?: boolean,
}): Object => {
	const {
		currentBlockStyleVariation,
		variationSurface: contextVariationSurface = VARIATION_SURFACE_STYLE,
		baseConfig,
		userConfig,
		usesSharedRootStyleVariation: contextUsesSharedRoot = false,
	} = useGlobalStylesPanelContext();
	const variationSurface = variationSurfaceProp ?? contextVariationSurface;

	const blockExtension = useSelect(
		(select) => {
			const { getBlockExtensionBy } = select(EXTENSIONS_STORE_NAME) || {};
			if (typeof getBlockExtensionBy !== 'function') {
				return null;
			}
			return getBlockExtensionBy('targetBlock', blockName);
		},
		[blockName]
	);

	const usesSharedRootStyleVariation = useMemo(() => {
		if (contextUsesSharedRoot) {
			return true;
		}

		return blockUsesSharedRootStyleVariation(
			getBlockVariationSupport(blockExtension)
		);
	}, [contextUsesSharedRoot, blockExtension]);

	const inspectorThemeConfigs = useSelect(
		(select: Function) =>
			inGlobalStylesPanel
				? { baseConfig: {}, userConfig: {} }
				: getThemeVariationConfigsFromCoreStore(select),
		[inGlobalStylesPanel]
	);

	const blockeraGlobalStylesMetaData = useSelect((registrySelect) => {
		try {
			const data =
				registrySelect(
					'blockera/editor'
				).getBlockeraGlobalStylesMetaData?.();
			if (data && typeof data === 'object') {
				return data;
			}
		} catch (_e) {
			//
		}
		if (
			typeof window !== 'undefined' &&
			typeof window.blockeraGlobalStylesMetaData === 'object' &&
			window.blockeraGlobalStylesMetaData !== null
		) {
			return window.blockeraGlobalStylesMetaData;
		}
		return {};
	}, []);

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

	const baseVars = effectiveBase?.styles?.blocks?.[blockName]?.variations;
	const userVars = effectiveUser?.styles?.blocks?.[blockName]?.variations;

	const mergedVariations = useMemo(
		() =>
			mergeBlockVariationsTrees(effectiveBase, effectiveUser, blockName),
		[blockName, baseVars, userVars]
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
		const baseList =
			filtered.length > 0 ? filtered : stylesFromWp.stylesToRender;
		const list = alignStyleRowsWithSharedRootVariation(
			baseList,
			mergedVariations,
			usesSharedRootStyleVariation
		);
		const storedStyleOrder = getStoredVariationOrder(
			blockName,
			VARIATION_SURFACE_STYLE,
			blockeraGlobalStylesMetaData
		);
		const orderedList = storedStyleOrder
			? sortVariationRowsBySlugOrder(list, storedStyleOrder)
			: list;
		const active = getActiveStyle(orderedList, stylesFromWp.className);
		const deleted = typeof active === 'string' ? active : false;
		return {
			...stylesFromWp,
			stylesToRender: orderedList,
			activeStyle: deleted ? getDefaultStyle(orderedList) : active,
			isDeletedStyle: deleted,
		};
	}, [
		stylesFromWp,
		mergedVariations,
		usesSharedRootStyleVariation,
		blockName,
		blockeraGlobalStylesMetaData,
	]);

	const sizeVariationMetaRoot = useMemo(
		() => blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations,
		[blockeraGlobalStylesMetaData, blockName]
	);

	const sizeVariationOrder = useMemo(
		() =>
			getBlockSizeVariationsOrder(
				effectiveBase,
				effectiveUser,
				blockName
			),
		[blockName, effectiveBase, effectiveUser]
	);

	const stylesFromSize = useSizeVariationsForBlocks({
		enabled: enabled && variationSurface === VARIATION_SURFACE_SIZE,
		clientId,
		blockName,
		mergedVariationsBySlug: mergedVariations,
		sizeVariationMetaRoot,
		inGlobalStylesPanel,
		usesSharedRootStyleVariation,
		sizeVariationOrder,
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
	const [currentPreviewStyle, setCurrentPreviewStyleState] = useState(null);
	// Sync ref: className updates from onSelect can re-render before preview state commits.
	const previewStyleRef = useRef(null);
	const setCurrentPreviewStyle = useCallback((style) => {
		previewStyleRef.current = style;
		setCurrentPreviewStyleState(style);
	}, []);

	useEffect(() => {
		if (variationSurface === VARIATION_SURFACE_SIZE) {
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

			// Keep committed selection stable during hover preview: className updates
			// immediately but currentActiveStyle must not sync until the picker closes.
			const hookName = activeStyle?.name ?? '';
			const curName = currentActiveStyle?.name ?? '';
			if (
				hookName !== curName &&
				previewStyleRef.current === null &&
				!isOpen
			) {
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
		currentPreviewStyle,
		isOpen,
		setCurrentActiveStyle,
		currentBlockStyleVariation,
	]);

	// Update cached style when active style changes
	useLateEffect(() => {
		if (
			previewStyleRef.current === null &&
			activeStyle?.name &&
			currentActiveStyle?.name &&
			activeStyle?.name !== currentActiveStyle?.name
		) {
			onSelect(currentActiveStyle);
		}
	}, [currentPreviewStyle]);

	const buttonText = useMemo(() => {
		if (isDeletedStyle) {
			return variationSurface === VARIATION_SURFACE_SIZE
				? __('Missing Size Variation', 'blockera')
				: __('Missing Style Variation', 'blockera');
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
			usesSharedRootStyleVariation,
		});

	if (!enabled) {
		return DISABLED_BLOCK_STYLE_VARIATIONS_PROPS;
	}

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
