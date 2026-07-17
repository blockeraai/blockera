// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import {
	useState,
	useRef,
	useEffect,
	useCallback,
	useMemo,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useBlockStylesCounter } from './use-block-styles-counter';
import { useBlockContext } from '../../../../extensions/components';
import { useGlobalStylesPanelContext } from '../context';
import { VARIATION_SURFACE_STYLE } from '../variation-surfaces';
import { type T_BLOCK_STYLES_PROPS } from './types';

// Shared counter map for promotion limits across picker instances.
export const blockDynamicStylesCount: Object = {};

type TUseBlockStylesPickerValueArgs = {
	blockName: string,
	styles: $PropertyType<T_BLOCK_STYLES_PROPS, 'styles'>,
	context?: $PropertyType<T_BLOCK_STYLES_PROPS, 'context'>,
	pickerVariationSurface?: string,
	isNotActive?: boolean,
	hasChangesets?: boolean,
	setChangesets?: (hasChangesets: boolean) => void,
	originDefaultAttributes?: Object,
	onPromotionBlocked?: () => void,
};

export const useBlockStylesPickerValue = ({
	blockName,
	styles,
	context = 'global-styles-panel',
	pickerVariationSurface,
	isNotActive = false,
	hasChangesets = false,
	setChangesets = () => {},
	originDefaultAttributes = {},
	onPromotionBlocked = () => {},
}: TUseBlockStylesPickerValueArgs): Object => {
	const {
		userConfig,
		baseConfig,
		style: editorStyles,
		setStyle: setStyles,
		setCurrentBlockStyleVariation,
		currentBlockStyleVariation,
		variationSurface: panelVariationSurface = VARIATION_SURFACE_STYLE,
	} = useGlobalStylesPanelContext();

	const variationSurface =
		pickerVariationSurface !== undefined && pickerVariationSurface !== ''
			? pickerVariationSurface
			: panelVariationSurface;

	const { isNormalState } = useBlockContext();
	const [counter, setCounter] = useBlockStylesCounter({
		blockName,
		baseConfig,
		userConfig,
		blockDynamicStylesCount,
		variationSurface,
	});
	const [blockStyles, setBlockStyles] = useState(styles.stylesToRender);
	const [hoveredStyle, setHoveredStyle] = useState(null);
	const hoveredStyleRef = useRef(null);
	// Tracks names last seen in `stylesToRender` so optimistic local rows can be
	// distinguished from styles that were unregistered (delete/rename).
	const previouslyRenderedNamesRef = useRef({});

	const MAX_ITEMS_FOR_PROMOTION = applyFilters(
		`blockera.block.${variationSurface}.variations.globalStylesMaxItems`,
		2
	);

	const handlePromotionPopover = useCallback((): boolean => {
		if (
			-1 !== MAX_ITEMS_FOR_PROMOTION &&
			counter >= MAX_ITEMS_FOR_PROMOTION
		) {
			onPromotionBlocked();

			return false;
		}

		return true;
	}, [counter, MAX_ITEMS_FOR_PROMOTION, onPromotionBlocked]);

	const {
		onSelect,
		setIsOpen,
		activeStyle: stylesActiveStyle,
		stylesToRender,
		setCurrentActiveStyle: stylesSetCurrentActiveStyle,
		setCurrentPreviewStyle,
	} = styles;

	const activeStyle =
		'global-styles-panel' === context
			? (currentBlockStyleVariation ?? stylesActiveStyle)
			: stylesActiveStyle;
	const fallbackSetCurrentActiveStyle =
		stylesSetCurrentActiveStyle ?? (() => {});
	const setCurrentActiveStyle =
		'global-styles-panel' === context
			? setCurrentBlockStyleVariation
			: fallbackSetCurrentActiveStyle;

	useEffect(() => {
		const rendered = stylesToRender || [];
		const renderedSet = {};
		for (let i = 0; i < rendered.length; i++) {
			renderedSet[rendered[i].name] = true;
		}

		// Snapshot before setState: keep optimistic rows until `stylesToRender`
		// catches up after registerBlockStyle, but drop rows that previously
		// appeared in the registry and are now gone (delete/rename/unregister).
		// Without that guard, a registry update that lands before the local
		// `setBlockStyles` remove commits will resurrect the deleted card.
		const previouslyRendered = previouslyRenderedNamesRef.current;

		setBlockStyles((previousStyles) => {
			if (!previousStyles.length) {
				return rendered;
			}

			const pending = [];
			for (let i = 0; i < previousStyles.length; i++) {
				const style = previousStyles[i];
				if (
					!renderedSet[style.name] &&
					!previouslyRendered[style.name]
				) {
					pending.push(style);
				}
			}

			return pending.length ? [...rendered, ...pending] : rendered;
		});

		previouslyRenderedNamesRef.current = renderedSet;
	}, [stylesToRender]);

	useEffect(() => {
		hoveredStyleRef.current = hoveredStyle;
	}, [hoveredStyle]);

	const onSelectStylePreview = useCallback(
		(style: string) => {
			if (!isNormalState()) {
				return;
			}

			setCurrentActiveStyle(style);
			onSelect(style);
			setIsOpen(false);
			setHoveredStyle(null);
		},
		[
			isNormalState,
			setCurrentActiveStyle,
			onSelect,
			setIsOpen,
			setHoveredStyle,
		]
	);

	const styleItemHandler = useCallback(
		(item: Object) => {
			if (!isNormalState()) {
				return;
			}

			if (hoveredStyle === item || activeStyle?.name === item?.name) {
				setHoveredStyle(null);
				setCurrentPreviewStyle(item);
				return;
			}

			if (item) {
				setHoveredStyle(item);
				setCurrentPreviewStyle(item);
				onSelect(item);
			} else {
				setCurrentPreviewStyle(null);
				setHoveredStyle(null);
			}
		},
		[
			onSelect,
			hoveredStyle,
			isNormalState,
			setHoveredStyle,
			activeStyle?.name,
			setCurrentPreviewStyle,
		]
	);

	return useMemo(
		() => ({
			blockName,
			counter,
			counterMap: blockDynamicStylesCount,
			setCounter,
			blockStyles,
			setBlockStyles,
			activeStyle,
			setCurrentActiveStyle,
			setCurrentBlockStyleVariation,
			handlePromotionPopover,
			onSelectStylePreview,
			setCurrentPreviewStyle,
			styleItemHandler,
			editorStyles: 'global-styles-panel' === context ? editorStyles : {},
			setStyles: 'global-styles-panel' === context ? setStyles : () => {},
			originDefaultAttributes,
			hasChangesets,
			setChangesets,
			isNotActive,
			variationSurface,
		}),
		[
			blockName,
			counter,
			blockStyles,
			activeStyle,
			setCounter,
			setBlockStyles,
			setCurrentActiveStyle,
			setCurrentBlockStyleVariation,
			handlePromotionPopover,
			onSelectStylePreview,
			setCurrentPreviewStyle,
			styleItemHandler,
			context,
			editorStyles,
			setStyles,
			originDefaultAttributes,
			hasChangesets,
			setChangesets,
			isNotActive,
			variationSurface,
		]
	);
};
