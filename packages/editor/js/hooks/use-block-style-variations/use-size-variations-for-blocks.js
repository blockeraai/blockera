// @flow
/**
 * External dependencies
 */
import { dispatch, select, useSelect } from '@wordpress/data';
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
import { filterRenderedStylesIncludingOnlySizes } from '../../editor/global-styles/variation-filters';
import { getBlockeraGlobalStylesMetaData } from '../../editor/global-styles/helpers';
import {
	getActiveSizeVariationFromClass,
	getActiveStyle,
	getRenderedStyles,
	replaceActiveSizeVariation,
	useGenericPreviewBlock,
	BLOCK_SIZE_VARIATION_CLASS_PREFIX,
} from '../../editor/global-styles/panel/ui/utils';
import { STORE_NAME } from '../../store/constants';

export function useSizeVariationsForBlocks({
	enabled,
	clientId,
	blockName,
	mergedVariationsBySlug,
	inGlobalStylesPanel = false,
	inspectorApplyClassName = false,
	event = 'click',
}: {
	enabled: boolean,
	clientId: string,
	blockName: string,
	mergedVariationsBySlug: Object,
	inGlobalStylesPanel?: boolean,
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

	const base = select('core').__experimentalGetCurrentThemeBaseGlobalStyles();

	const stylesToRender = useMemo(() => {
		if (!enabled) {
			return [];
		}

		const rendered = getRenderedStyles(
			styles,
			prepare(`styles.blocks.${blockName}.variations`, base) || {},
			blockName,
			inGlobalStylesPanel
		);

		const sizesOnly = filterRenderedStylesIncludingOnlySizes(
			rendered,
			mergedVariationsBySlug
		);

		return enrichSizeVariationRowsFromMerged(
			sizesOnly,
			mergedVariationsBySlug,
			blockName
		);
	}, [
		enabled,
		styles,
		blockName,
		base,
		inGlobalStylesPanel,
		mergedVariationsBySlug,
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

	const genericPreviewBlock = useGenericPreviewBlock(block, blockType);

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
				return getDefaultFromSizeList(stylesToRender);
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
				return getDefaultFromSizeList(stylesToRender);
			}

			return null;
		}

		const selName = selectedFromStore?.name;
		if (!selName) {
			return null;
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
	const prevHadKnownSizeClassRef = useRef(false);

	useEffect(() => {
		inspectorSizeChoiceHandledRef.current = false;
		prevHadKnownSizeClassRef.current = false;
	}, [clientId, blockName]);

	const knownSizeSlugs = useMemo(() => {
		return new Set(
			(stylesToRender || []).map((s) =>
				typeof s?.name === 'string' ? s.name : ''
			)
		);
	}, [stylesToRender]);

	useEffect(() => {
		if (!inspectorApplyClassName || !enabled) {
			return;
		}

		const nowHasKnown = classNameHasKnownIsSizeSlug(
			className,
			knownSizeSlugs
		);

		if (prevHadKnownSizeClassRef.current && !nowHasKnown) {
			inspectorSizeChoiceHandledRef.current = true;
		}
		prevHadKnownSizeClassRef.current = nowHasKnown;
	}, [inspectorApplyClassName, enabled, className, knownSizeSlugs]);

	useEffect(() => {
		if (!inspectorApplyClassName || !enabled || !clientId) {
			return;
		}
		if (inspectorSizeChoiceHandledRef.current) {
			return;
		}
		if (!stylesToRender?.length) {
			return;
		}

		const defaultRow = stylesToRender.find(
			(s) => s.blockeraIsDefaultVariation === true
		);
		if (!defaultRow?.name) {
			return;
		}

		if (classNameHasKnownIsSizeSlug(className, knownSizeSlugs)) {
			return;
		}

		const nextClass = replaceActiveSizeVariation(
			className,
			null,
			defaultRow,
			'click'
		);

		if (nextClass === className) {
			return;
		}

		updateBlockAttributes(clientId, {
			className: nextClass,
		});
	}, [
		inspectorApplyClassName,
		enabled,
		clientId,
		stylesToRender,
		className,
		knownSizeSlugs,
		updateBlockAttributes,
	]);

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
			? getDefaultFromSizeList(stylesToRender)
			: activeStyle,
		isDeletedStyle: missingUnknownSizeSlug,
		genericPreviewBlock,
		className,
		previewClassName: '',
	};
}

function classNameHasKnownIsSizeSlug(
	className: string,
	knownSlugs: Set<string>
): boolean {
	const prefixLen = BLOCK_SIZE_VARIATION_CLASS_PREFIX.length;

	for (const cls of new TokenList(className || '').values()) {
		if (
			cls.indexOf(BLOCK_SIZE_VARIATION_CLASS_PREFIX) !== 0 ||
			cls.length <= prefixLen
		) {
			continue;
		}

		const slug = cls.slice(prefixLen);
		if (knownSlugs.has(slug)) {
			return true;
		}
	}

	return false;
}

function enrichSizeVariationRowsFromMerged(
	rows: Array<Object>,
	mergedBySlug: Object,
	blockName: string
): Array<Object> {
	const metaRoot =
		getBlockeraGlobalStylesMetaData()?.blocks?.[blockName]?.variations ||
		{};

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

		const mergedFlags =
			data !== null && typeof data === 'object'
				? {
						blockeraVariationType: data.blockeraVariationType,
						blockeraIsDefaultVariation:
							data.blockeraIsDefaultVariation === true,
					}
				: {};

		return {
			...row,
			label: metaLabel || row.label || dataLabel || dataTitle || slug,
			...mergedFlags,
		};
	});
}

function getDefaultFromSizeList(styles: Array<Object>): Object | null {
	return styles.find((s) => s.isDefault) || styles[0] || null;
}
