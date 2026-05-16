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
import { mergeBlockGlobalStyles } from './utils';
import { StyleDefaultRenderer } from './style-default-renderer';
import { getBlockAttributes } from '../global-styles/panel/context/index';
import { getBlockeraGlobalStylesMetaData } from '../global-styles/helpers';
import { getBaseBreakpoint } from '../header-ui/components/breakpoints/helpers';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';
import { prepareBlockeraDefaultAttributesValues } from '../../extensions/components/utils';
import { getCompatibleAttributes as getCompatibleStyles } from '../../extensions/components/get-compatible-attributes';

type GlobalStylesProps = {
	args: Object,
	blockeraMetaData: Object,
	blockType: Object,
	mergedGlobalStyles: Object,
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
	if (!Object.is(prev.mergedGlobalStyles, next.mergedGlobalStyles)) {
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
	editorSelectedBlockEvent: mixed,
	selectShape: IframeSelectorsShape,
	getActiveBlockVariation: Function
): Object {
	const { getBlockExtensionBy, _getActiveBlockVariation } = selectShape;
	const entries = blockTypes.map((blockType: Object) => [
		blockType.name,
		{
			blockId: blockType.name,
			blockClientId: blockType.name.replace('/', '-'),
			insideBlockInspector: false,
			editorSelectedBlockEvent,
			isMasterNormalState: 'normal',
			isNormalState: true,
			isMasterBlock: true,
			isBaseBreakpoint: true,
			currentBreakpoint: getBaseBreakpoint(),
			currentBlock: blockType.name,
			currentState: 'normal',
			blockVariations: blockType.variations,
			activeBlockVariation: _getActiveBlockVariation(),
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
	mergedGlobalStyles,
}: GlobalStylesProps): MixedElement | null {
	const blockName =
		blockType && typeof blockType.name === 'string' ? blockType.name : '';

	const rawStylesForBlock = useMemo(() => {
		if (!blockName) {
			return {};
		}
		return mergedGlobalStyles?.[blockName] || {};
	}, [mergedGlobalStyles, blockName]);

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
		if (typeof getCompatibleStyles !== 'function') {
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
 * Caches iframe `compat` args until schema (attributes/variations), editor selection,
 * or active variation signal changes — avoids rebuilding every store tick.
 */
const GlobalStylesIframeBundle: ComponentType<{}> = memo((): MixedElement => {
	const iframeCompatArgsBundleCacheRef = useRef({
		schemaFingerprint: '',
		editorSelectedBlockEvent: (undefined: mixed),
		activeVariationKey: '',
		args: (null: null | Object),
	});

	const iframeSelectorsRef = useRef<null | {
		selectSnapshot: IframeSelectorsShape,
		getActiveBlockVariation: Function,
	}>(null);

	const {
		activeVariationKey,
		baseGlobalStyles,
		blockTypes,
		blockSchemaFingerprint,
		blockeraMetaData,
		editorSelectedBlockEvent,
		getActiveBlockVariation,
		selectSnapshot,
		userGlobalStyles,
	} = useSelect((select) => {
		const editor = select('blockera/editor');

		const { getGlobalStyles, getEditorSelectedBlockEvent } = editor;

		const editorSelectedBlockEvent = getEditorSelectedBlockEvent();

		const userStyles = getGlobalStyles()?.userStyles || {};
		const storeMetaData = userStyles?.blockeraMetaData || {};
		const windowMetaData = getBlockeraGlobalStylesMetaData() || {};

		const base =
			select('core').__experimentalGetCurrentThemeBaseGlobalStyles();

		const { getBlockTypes, getActiveBlockVariation } =
			select('core/blocks');
		const filtered = getBlockTypes().filter((blockType: Object) =>
			blockType.attributes.hasOwnProperty('blockeraPropsId')
		);
		const schemaFingerprint = iframeBlockTypesSchemaFingerprint(filtered);
		const {
			getBlockExtensionBy,
			getActiveBlockVariation: _getActiveBlockVariation,
		} = select('blockera/extensions');
		const rawActive = _getActiveBlockVariation();
		let nextActiveVariationKey = '';
		if (rawActive && typeof rawActive === 'object') {
			if (typeof rawActive.name === 'string') {
				nextActiveVariationKey = rawActive.name;
			}
		} else if (
			rawActive !== null &&
			rawActive !== undefined &&
			typeof rawActive !== 'object'
		) {
			nextActiveVariationKey = String(rawActive);
		}

		return {
			activeVariationKey: nextActiveVariationKey,
			baseGlobalStyles: base?.styles?.blocks || {},
			blockTypes: filtered,
			blockSchemaFingerprint: schemaFingerprint,
			blockeraMetaData: mergeObject(storeMetaData, windowMetaData),
			editorSelectedBlockEvent,
			getActiveBlockVariation,
			selectSnapshot: {
				getBlockExtensionBy,
				_getActiveBlockVariation,
			},
			userGlobalStyles: userStyles?.styles?.blocks || {},
		};
	}, []);

	const mergedGlobalStyles = useMemo(
		() => mergeBlockGlobalStyles(baseGlobalStyles, userGlobalStyles),
		[baseGlobalStyles, userGlobalStyles]
	);

	iframeSelectorsRef.current = {
		selectSnapshot,
		getActiveBlockVariation,
	};

	const compatArgsByBlockName = useMemo(() => {
		const snap = iframeSelectorsRef.current;
		if (!snap) {
			return {};
		}
		const cached = iframeCompatArgsBundleCacheRef.current;
		const hit =
			cached.args !== null &&
			cached.schemaFingerprint === blockSchemaFingerprint &&
			Object.is(
				cached.editorSelectedBlockEvent,
				editorSelectedBlockEvent
			) &&
			cached.activeVariationKey === activeVariationKey;

		if (hit) {
			return cached.args;
		}

		const nextArgs = buildIframeCompatArgsBundle(
			blockTypes,
			editorSelectedBlockEvent,
			snap.selectSnapshot,
			snap.getActiveBlockVariation
		);

		cached.schemaFingerprint = blockSchemaFingerprint;
		cached.editorSelectedBlockEvent = editorSelectedBlockEvent;
		cached.activeVariationKey = activeVariationKey;
		cached.args = nextArgs;
		return nextArgs;
		// Snapshot ref holds latest selectors; primitives drive invalidation.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		blockSchemaFingerprint,
		blockTypes,
		editorSelectedBlockEvent,
		activeVariationKey,
	]);

	return (
		<>
			{blockTypes.map((blockType: Object) => (
				<GlobalStyles
					args={compatArgsByBlockName[blockType.name]}
					blockType={blockType}
					blockeraMetaData={blockeraMetaData}
					key={blockType.name}
					mergedGlobalStyles={mergedGlobalStyles}
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
