// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';
import { useEffect, memo, useMemo, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { mergeObject, cloneObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getStableMergedBlockStyles, retainStableSnapshot } from './utils';
import { StyleDefaultRenderer } from './style-default-renderer';
import { getBlockAttributes } from '../global-styles/panel/context/index';
import { getBlockeraGlobalStylesMetaData } from '../global-styles/helpers';
import { getBaseBreakpoint } from '../header-ui/components/breakpoints/helpers';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';
import { prepareBlockeraDefaultAttributesValues } from '../../extensions/components/utils';
import { getCompatibleAttributes as getCompatibleStyles } from '../../extensions/components/get-compatible-attributes';

const EMPTY_BLOCKS_STYLES: Object = {};

type GlobalStylesProps = {
	args: Object,
	blockeraMetaData: Object,
	blockType: Object,
	rawStylesForBlock: Object,
};

/**
 * Narrow equality: skips child re-render when bundle passes stable snapshots.
 */
function areGlobalStylesPropsEqual(
	prev: GlobalStylesProps,
	next: GlobalStylesProps
): boolean {
	if (!Object.is(prev.args, next.args)) {
		return false;
	}
	if (!Object.is(prev.rawStylesForBlock, next.rawStylesForBlock)) {
		return false;
	}
	if (!Object.is(prev.blockeraMetaData, next.blockeraMetaData)) {
		return false;
	}
	const pn = prev.blockType?.name;
	const nn = next.blockType?.name;
	if (pn !== nn) {
		return false;
	}
	return prev.blockType?.attributes === next.blockType?.attributes;
}

/**
 * Canonical string for iframe bundle cache invalidation — attributes schema + WP variation names.
 * Any change here must rebuild iframe `compat` args passed into {@see getCompatibleStyles}.
 */
function getIframeBlockTypeSchemaSignature(blockType: Object): string {
	const attrs = blockType?.attributes;
	let attrPart = '';
	if (attrs && typeof attrs === 'object') {
		const keys = Object.keys(attrs).sort();
		attrPart =
			keys
				.map((key) => {
					try {
						return `${key}:${JSON.stringify(attrs[key])}`;
					} catch (_e) {
						return `${key}:!`;
					}
				})
				.join('|') || '_';
	}
	let varPart = '';
	if (Array.isArray(blockType?.variations)) {
		const names = [...blockType.variations]
			.map((v) => (v && typeof v.name === 'string' ? v.name : ''))
			.sort();
		try {
			varPart = JSON.stringify(names);
		} catch (_e) {
			varPart = '';
		}
	}
	return `${blockType?.name ?? ''}:${attrPart}::${varPart}`;
}

function iframeBlockTypesSchemaFingerprint(blockTypes: Array<Object>): string {
	return blockTypes
		.map((b) => getIframeBlockTypeSchemaSignature(b))
		.sort()
		.join(';');
}

type IframeSelectorsShape = {
	getActiveBlockVariation: Function,
	_getActiveBlockVariation: Function,
	getBlockExtensionBy: Function,
};

function buildIframeCompatArgsBundle(
	blockTypes: Array<Object>,
	selectShape: IframeSelectorsShape,
	getActiveBlockVariation: Function
): Object {
	const { getBlockExtensionBy } = selectShape;
	const entries = blockTypes.map((blockType: Object) => [
		blockType.name,
		{
			blockId: blockType.name,
			blockClientId: blockType.name.replace('/', '-'),
			insideBlockInspector: false,
			editorSelectedBlockEvent: undefined,
			isMasterNormalState: 'normal',
			isNormalState: true,
			isMasterBlock: true,
			isBaseBreakpoint: true,
			currentBreakpoint: getBaseBreakpoint(),
			currentBlock: blockType.name,
			currentState: 'normal',
			blockVariations: blockType.variations,
			activeBlockVariation: null,
			getActiveBlockVariation,
			blockAttributes: prepareBlockeraDefaultAttributesValues(
				blockType.attributes,
				{
					context: 'global-styles-panel',
				}
			),
			innerBlocks:
				getBlockExtensionBy('targetBlock', blockType.name)
					?.blockeraInnerBlocks || {},
		},
	]);
	return Object.fromEntries(entries);
}

/**
 * Renders merged global styles for a single WordPress block type.
 * When `getCompatibleStyles` is set, it is applied to the root block slice (omit `variations`)
 * and to each variation’s own object before merging back into `{ ...root, variations }`.
 */
function GlobalStylesComponent({
	args,
	blockType,
	blockeraMetaData,
	rawStylesForBlock,
}: GlobalStylesProps): MixedElement | null {
	const blockName =
		blockType && typeof blockType.name === 'string' ? blockType.name : '';

	const compatibleStylesCacheRef = useRef({
		args: (null: null | Object),
		rawStylesForBlock: (EMPTY_BLOCKS_STYLES: Object),
		styles: (EMPTY_BLOCKS_STYLES: Object),
	});

	const { blockeraOverrideBlockAttributes } = useMemo(
		() => getBlockAttributes(blockType.name),
		[blockType.name]
	);
	const originDefaultAttributes = useMemo(() => {
		return mergeObject(
			blockeraOverrideBlockAttributes,
			blockType.attributes
		);
	}, [blockType.attributes, blockeraOverrideBlockAttributes]);

	const styles = useMemo(() => {
		const cache = compatibleStylesCacheRef.current;
		if (
			Object.is(cache.args, args) &&
			Object.is(cache.rawStylesForBlock, rawStylesForBlock)
		) {
			return cache.styles;
		}

		if (typeof getCompatibleStyles !== 'function') {
			cache.args = args;
			cache.rawStylesForBlock = rawStylesForBlock;
			cache.styles = rawStylesForBlock;
			return rawStylesForBlock;
		}

		const raw =
			rawStylesForBlock && typeof rawStylesForBlock === 'object'
				? rawStylesForBlock
				: {};

		const { variations: rawVariations, ...rootWithoutVariations } = raw;

		const compatibleRoot = getCompatibleStyles({
			args,
			isActive: true,
			availableAttributes: blockType.attributes,
			defaultAttributes: originDefaultAttributes,
			attributes: cloneObject(rootWithoutVariations),
		});

		const sourceVariations =
			rawVariations && typeof rawVariations === 'object'
				? rawVariations
				: {};

		const compatibleVariations: Object = {};
		for (const [slug, variationSlice] of Object.entries(sourceVariations)) {
			compatibleVariations[slug] = getCompatibleStyles({
				args,
				isActive: true,
				availableAttributes: blockType.attributes,
				defaultAttributes: originDefaultAttributes,
				attributes: cloneObject(variationSlice),
			});
		}

		const merged: Object = {
			...(compatibleRoot && typeof compatibleRoot === 'object'
				? compatibleRoot
				: {}),
		};

		if (Object.keys(compatibleVariations).length > 0) {
			merged.variations = compatibleVariations;
		}

		cache.args = args;
		cache.rawStylesForBlock = rawStylesForBlock;
		cache.styles = merged;
		return merged;
	}, [
		args,
		rawStylesForBlock,
		blockType.attributes,
		originDefaultAttributes,
	]);

	if (!blockType || !blockName) {
		return null;
	}

	return (
		<StyleDefaultRenderer
			blockeraMetaData={blockeraMetaData}
			blockType={blockType}
			key={blockName}
			styles={styles}
		/>
	);
}

export const GlobalStyles: ComponentType<GlobalStylesProps> = memo(
	GlobalStylesComponent,
	areGlobalStylesPropsEqual
);

/**
 * Iframe root: one {@see GlobalStyles} per registered Blockera block type.
 * Caches iframe `compat` args until block schema changes — avoids rebuilding on
 * unrelated editor ticks (selection, device type, etc.).
 */
const GlobalStylesIframeBundle: ComponentType<{}> = memo((): MixedElement => {
	const iframeCompatArgsBundleCacheRef = useRef({
		schemaFingerprint: '',
		args: (null: null | Object),
	});

	const blockTypesCacheRef = useRef({
		schemaFingerprint: '',
		blockTypes: ([]: Array<Object>),
	});

	const mergedBlockStylesCacheRef = useRef(new Map());

	const blockeraMetaDataCacheRef = useRef(({}: Object));
	const userBlockStylesCacheRef = useRef((EMPTY_BLOCKS_STYLES: Object));
	const baseBlockStylesCacheRef = useRef((EMPTY_BLOCKS_STYLES: Object));

	const iframeSelectorsRef = useRef<null | {
		selectSnapshot: IframeSelectorsShape,
		getActiveBlockVariation: Function,
	}>(null);

	const blockSchemaFingerprint = useSelect((select) => {
		const { getBlockTypes } = select('core/blocks');
		const filtered = getBlockTypes().filter((blockType: Object) =>
			blockType.attributes.hasOwnProperty('blockeraPropsId')
		);
		const fingerprint = iframeBlockTypesSchemaFingerprint(filtered);
		const cached = blockTypesCacheRef.current;
		if (cached.schemaFingerprint !== fingerprint) {
			cached.schemaFingerprint = fingerprint;
			cached.blockTypes = filtered;
		}
		return fingerprint;
	}, []);

	const userBlockStyles = useSelect((select) => {
		const blocks =
			select('blockera/editor').getGlobalStyles()?.userStyles?.styles
				?.blocks;
		return blocks && typeof blocks === 'object'
			? blocks
			: EMPTY_BLOCKS_STYLES;
	}, []);

	const baseBlockStyles = useSelect((select) => {
		const base =
			select('core').__experimentalGetCurrentThemeBaseGlobalStyles();
		const blocks = base?.styles?.blocks;
		return blocks && typeof blocks === 'object'
			? blocks
			: EMPTY_BLOCKS_STYLES;
	}, []);

	const storeBlockeraMetaData = useSelect((select) => {
		return (
			select('blockera/editor').getBlockeraGlobalStylesMetaData?.() ?? {}
		);
	}, []);

	const rawBlockeraMetaData = useMemo(
		() =>
			mergeObject(
				storeBlockeraMetaData,
				getBlockeraGlobalStylesMetaData() || {}
			),
		[storeBlockeraMetaData]
	);

	useSelect((select) => {
		const { getActiveBlockVariation } = select('core/blocks');
		const { getBlockExtensionBy } = select('blockera/extensions');
		iframeSelectorsRef.current = {
			getActiveBlockVariation,
			selectSnapshot: {
				getBlockExtensionBy,
				_getActiveBlockVariation: () => null,
			},
		};
		return getBlockExtensionBy;
	}, []);

	const stableUserBlockStyles = retainStableSnapshot(
		userBlockStylesCacheRef,
		userBlockStyles
	);
	const stableBaseBlockStyles = retainStableSnapshot(
		baseBlockStylesCacheRef,
		baseBlockStyles
	);
	const blockeraMetaData = retainStableSnapshot(
		blockeraMetaDataCacheRef,
		rawBlockeraMetaData
	);

	const blockTypes = blockTypesCacheRef.current.blockTypes;

	const compatArgsByBlockName = useMemo(() => {
		const snap = iframeSelectorsRef.current;
		if (!snap) {
			return {};
		}
		const cached = iframeCompatArgsBundleCacheRef.current;
		if (
			cached.args !== null &&
			cached.schemaFingerprint === blockSchemaFingerprint
		) {
			return cached.args;
		}

		const nextArgs = buildIframeCompatArgsBundle(
			blockTypes,
			snap.selectSnapshot,
			snap.getActiveBlockVariation
		);

		cached.schemaFingerprint = blockSchemaFingerprint;
		cached.args = nextArgs;
		return nextArgs;
	}, [blockSchemaFingerprint, blockTypes]);

	return (
		<>
			{blockTypes.map((blockType: Object) => (
				<GlobalStyles
					args={compatArgsByBlockName[blockType.name]}
					blockType={blockType}
					blockeraMetaData={blockeraMetaData}
					key={blockType.name}
					rawStylesForBlock={getStableMergedBlockStyles(
						mergedBlockStylesCacheRef.current,
						blockType.name,
						stableBaseBlockStyles,
						stableUserBlockStyles
					)}
				/>
			))}
		</>
	);
});

export default function GlobalStylesheet(): MixedElement {
	useEffect(() => {
		new IntersectionObserverRenderer('iframe', GlobalStylesIframeBundle, {
			isRootComponent: true,
			targetElementIsRoot: true,
			componentSelector: '#blockera-global-styles-wrapper',
			observeRootSelector: '.interface-interface-skeleton',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
