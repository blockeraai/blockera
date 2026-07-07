// @flow
/**
 * External dependencies
 */
import { dispatch, useSelect } from '@wordpress/data';
import { useMemo, useCallback, useEffect, useRef } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as blocksStore, getBlockType } from '@wordpress/blocks';
import TokenList from '@wordpress/token-list';

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import {
	isSizeVariationEntry,
	filterRenderedStylesIncludingOnlySizes,
} from '../../editor/global-styles/variation-filters';
import { getBlockeraGlobalStylesMetaData } from '../../editor/global-styles/helpers';
import {
	getActiveSizeVariationFromClass,
	getActiveStyle,
	getRenderedStyles,
	getDefaultStyle,
	replaceActiveSizeVariation,
	useGenericPreviewBlock,
} from '../../editor/global-styles/panel/ui/utils';
import { normalizeSizeVariationRows } from '../../editor/global-styles/panel/size-variations';
import {
	getStoredVariationOrder,
	sortVariationRowsBySlugOrder,
} from '../../editor/global-styles/panel/variation-order';
import { VARIATION_SURFACE_SIZE } from '../../editor/global-styles/panel/variation-surfaces';
import { STORE_NAME } from '../../store/constants';

export function useSizeVariationsForBlocks({
	enabled,
	clientId,
	blockName,
	mergedVariationsBySlug,
	sizeVariationMetaRoot,
	inGlobalStylesPanel = false,
	usesSharedRootStyleVariation = false,
	sizeVariationOrder,
	inspectorApplyClassName = false,
	event = 'click',
}: {
	enabled: boolean,
	clientId: string,
	blockName: string,
	mergedVariationsBySlug: Object,
	sizeVariationMetaRoot?: Object,
	inGlobalStylesPanel?: boolean,
	usesSharedRootStyleVariation?: boolean,
	sizeVariationOrder?: Array<string>,
	inspectorApplyClassName?: boolean,
	event?: 'click' | 'detach',
}): Object {
	const stylesRegistrySliceSelector = (registrySelect: Function) => {
		const { getBlock } = registrySelect(blockEditorStore);
		let nextBlock = getBlock(clientId);

		if (!nextBlock) {
			nextBlock = {
				name: blockName,
				attributes: {
					className: '',
				},
			};
		}

		const blockType = getBlockType(nextBlock.name);
		const { getBlockStyles } = registrySelect(blocksStore);

		return {
			block: nextBlock,
			blockType,
			styles: getBlockStyles(nextBlock.name),
			className: nextBlock.attributes?.className || '',
		};
	};

	const { styles, block, blockType, className } = useSelect(
		stylesRegistrySliceSelector,
		[clientId, blockName]
	);

	const themeBaseGlobalStyles = useSelect(
		(registrySelect) => {
			if (!enabled) {
				return null;
			}
			const core = registrySelect('core');
			return typeof core.__experimentalGetCurrentThemeBaseGlobalStyles ===
				'function'
				? core.__experimentalGetCurrentThemeBaseGlobalStyles()
				: null;
		},
		[enabled]
	);

	const blockeraGlobalStylesMetaData = useSelect(
		(sel: Function) =>
			sel(STORE_NAME).getBlockeraGlobalStylesMetaData?.() ?? {},
		[]
	);

	const stylesToRender = useMemo(() => {
		if (!enabled) {
			return [];
		}

		const rendered = getRenderedStyles(
			styles,
			prepare(
				`styles.blocks.${blockName}.variations`,
				themeBaseGlobalStyles || {}
			) || {},
			blockName,
			inGlobalStylesPanel
		);

		const sizesOnly = appendMissingSizeVariationRows(
			filterRenderedStylesIncludingOnlySizes(
				rendered,
				mergedVariationsBySlug
			),
			mergedVariationsBySlug
		);

		const normalized = normalizeSizeVariationRows(
			enrichSizeVariationRowsFromMerged(
				sizesOnly,
				mergedVariationsBySlug,
				blockName,
				sizeVariationMetaRoot
			),
			usesSharedRootStyleVariation,
			sizeVariationOrder
		);
		const storedSizeOrder = getStoredVariationOrder(
			blockName,
			VARIATION_SURFACE_SIZE,
			blockeraGlobalStylesMetaData
		);

		return storedSizeOrder
			? sortVariationRowsBySlugOrder(normalized, storedSizeOrder)
			: normalized;
	}, [
		enabled,
		styles,
		blockName,
		themeBaseGlobalStyles,
		inGlobalStylesPanel,
		mergedVariationsBySlug,
		sizeVariationMetaRoot,
		usesSharedRootStyleVariation,
		sizeVariationOrder,
		blockeraGlobalStylesMetaData,
	]);

	const selectedFromStore = useSelect(
		(sel: Function) => {
			if (!enabled || inspectorApplyClassName) {
				return undefined;
			}
			return sel(STORE_NAME).getSelectedBlockSizeVariation?.();
		},
		[enabled, inspectorApplyClassName]
	);

	const genericPreviewBlock = useGenericPreviewBlock(
		block,
		blockType,
		!enabled
	);

	const { setSelectedBlockSizeVariation } = dispatch(STORE_NAME);
	const { updateBlockAttributes } = dispatch(blockEditorStore);

	// Only unknown `is-size-*` slugs qualify as "missing". Legitimate `is-style-*`
	// tokens must not be fed through {@see getActiveStyle} against the size-only row
	// list — that falsely marked the size control deleted whenever a style class existed.
	const missingUnknownSizeSlug = useMemo(() => {
		if (!inspectorApplyClassName || !enabled) {
			return false;
		}

		const resolved = getActiveSizeVariationFromClass(
			stylesToRender,
			className
		);

		return typeof resolved === 'string' ? resolved : false;
	}, [inspectorApplyClassName, enabled, stylesToRender, className]);

	const activeStyle = useMemo(() => {
		if (!enabled || !stylesToRender.length) {
			return null;
		}

		if (inspectorApplyClassName) {
			const viaSizePrefix = getActiveSizeVariationFromClass(
				stylesToRender,
				className
			);

			if (viaSizePrefix && typeof viaSizePrefix === 'object') {
				return viaSizePrefix;
			}

			if (typeof viaSizePrefix === 'string') {
				return getDefaultStyle(stylesToRender);
			}

			let matchedLegacyStyle = null;
			for (const cls of new TokenList(className || '').values()) {
				if (cls.indexOf('is-style-') !== 0) {
					continue;
				}
				const slug = cls.substring(9);
				const row = stylesToRender.find((s) => s.name === slug);
				if (row) {
					matchedLegacyStyle = row;
					break;
				}
			}

			if (matchedLegacyStyle) {
				return matchedLegacyStyle;
			}

			const ghost = getActiveStyle(stylesToRender, className);
			if (typeof ghost === 'string') {
				return getDefaultStyle(stylesToRender);
			}

			return getDefaultStyle(stylesToRender);
		}

		const selName = selectedFromStore?.name;
		if (!selName) {
			return getDefaultStyle(stylesToRender);
		}
		return stylesToRender.find((s) => s.name === selName) || null;
	}, [
		enabled,
		stylesToRender,
		inspectorApplyClassName,
		className,
		selectedFromStore?.name,
	]);

	const isDeletedStyle = Boolean(missingUnknownSizeSlug);

	const inspectorSizeChoiceHandledRef = useRef(false);

	useEffect(() => {
		inspectorSizeChoiceHandledRef.current = false;
	}, [clientId, blockName]);

	const onSelect = useCallback(
		(newStyle: Object) => {
			if (inspectorApplyClassName) {
				inspectorSizeChoiceHandledRef.current = true;
			}

			setSelectedBlockSizeVariation(newStyle);

			if (!inspectorApplyClassName || !clientId) {
				return;
			}

			const styleClassName = replaceActiveSizeVariation(
				className,
				activeStyle,
				newStyle,
				event
			);
			updateBlockAttributes(clientId, {
				className: styleClassName,
			});
		},
		[
			setSelectedBlockSizeVariation,
			inspectorApplyClassName,
			clientId,
			className,
			activeStyle,
			event,
			updateBlockAttributes,
		]
	);

	return {
		onSelect,
		stylesToRender,
		activeStyle: isDeletedStyle
			? getDefaultStyle(stylesToRender)
			: activeStyle,
		isDeletedStyle: missingUnknownSizeSlug,
		genericPreviewBlock,
		className,
		previewClassName: '',
	};
}

function enrichSizeVariationRowsFromMerged(
	rows: Array<Object>,
	mergedBySlug: Object,
	blockName: string,
	metaRootOverride?: Object
): Array<Object> {
	const metaRoot =
		(metaRootOverride && typeof metaRootOverride === 'object'
			? metaRootOverride
			: getBlockeraGlobalStylesMetaData()?.blocks?.[blockName]
					?.variations) || {};

	return rows.map((row) => {
		const slug = row.name;
		const data = mergedBySlug[slug];
		const meta = metaRoot[slug] || {};
		const metaLabel =
			typeof meta.label === 'string' && meta.label.trim()
				? meta.label
				: '';
		const dataLabel =
			data !== null &&
			typeof data === 'object' &&
			typeof data.label === 'string' &&
			data.label.trim()
				? data.label
				: '';
		const dataTitle =
			data !== null &&
			typeof data === 'object' &&
			typeof data.title === 'string' &&
			data.title.trim()
				? data.title
				: '';

		const mergedFlags: Object =
			data !== null && typeof data === 'object'
				? {
						blockeraVariationType: data.blockeraVariationType,
						blockeraIsDefaultVariation:
							data.blockeraIsDefaultVariation === true,
					}
				: {};

		const isDefaultFromMeta = meta.isDefault === true;
		const isDefaultFromTheme =
			data !== null &&
			typeof data === 'object' &&
			data.blockeraIsDefaultVariation === true;

		return {
			...row,
			label: metaLabel || row.label || dataLabel || dataTitle || slug,
			...(mergedFlags ? mergedFlags : {}),
			...(isDefaultFromMeta || isDefaultFromTheme
				? { isDefault: true }
				: {}),
		};
	});
}

function appendMissingSizeVariationRows(
	rows: Array<Object>,
	mergedBySlug: Object
): Array<Object> {
	const existing = new Set(rows.map((row) => row.name));
	const missingRows = [];

	for (const [slug, data] of Object.entries(mergedBySlug || {})) {
		if (existing.has(slug) || !isSizeVariationEntry(data)) {
			continue;
		}

		missingRows.push({
			name: slug,
			label:
				// $FlowFixMe
				data?.label ||
				// $FlowFixMe
				data?.title ||
				slug,
			icon: {
				name: 'blockera',
				library: 'blockera',
			},
		});
	}

	return [...rows, ...missingRows];
}
