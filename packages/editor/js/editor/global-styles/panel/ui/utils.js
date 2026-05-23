// @flow
/**
 * External Dependencies
 */
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	store as blocksStore,
	cloneBlock,
	getBlockFromExample,
	getBlockType,
} from '@wordpress/blocks';
import { useDispatch, useSelect, select } from '@wordpress/data';
import TokenList from '@wordpress/token-list';
import { _x } from '@wordpress/i18n';
import { useMemo, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';
import { isString, kebabCase } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getBlockeraGlobalStylesMetaData } from '../../helpers';

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/utils'
 *
 * Returns the active style from the given className.
 */
export function getActiveStyle(
	styles: Array<any>,
	className: string
): Object | string {
	for (const style of new TokenList(className).values()) {
		if (style.indexOf('is-style-') === -1) {
			continue;
		}

		const potentialStyleName = style.substring(9);

		const activeStyle = styles?.find(
			({ name }) => name === potentialStyleName
		);

		if (activeStyle) {
			return activeStyle;
		}
		return potentialStyleName;
	}

	return getDefaultStyle(styles);
}

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/utils'
 * but the BlockCard section edited (used exact code)
 *
 * Replaces or removes the active `is-style-{slug}` in the block className only.
 * `is-size-*` tokens from size variations are left unchanged.
 */
export function replaceActiveStyle(
	className: string,
	activeStyle: Object,
	newStyle: Object,
	event: 'click' | 'detach'
): string {
	const list = new TokenList(className);

	if (activeStyle) {
		list.remove('is-style-' + activeStyle.name);
	}

	// We should not add style variation classname when occurred `detach` event.
	if ('detach' === event) {
		return list.value;
	}

	list.add('is-style-' + newStyle.name);

	return list.value;
}

/** Class prefix Blockera applies for **size** variations on the block (`is-size-{slug}`). */
export const BLOCK_SIZE_VARIATION_CLASS_PREFIX = 'is-size-';

/** Resolve size variation row from {@code stylesToRender}, unknown slug string, or null. */
export function getActiveSizeVariationFromClass(
	stylesToRender: Array<any>,
	className: string
): Object | string | null {
	const p = BLOCK_SIZE_VARIATION_CLASS_PREFIX;
	const pLen = p.length;

	for (const token of new TokenList(className || '').values()) {
		if (token.indexOf(p) !== 0) {
			continue;
		}

		const slug = token.substring(pLen);
		const row = stylesToRender?.find((s) => s.name === slug);

		if (row) {
			return row;
		}

		return slug;
	}

	return null;
}

/**
 * Replaces {@code is-size-{slug}} tokens (single active size).
 * Mirrors {@see replaceActiveStyle} but never touches {@code is-style-*} tokens.
 */
export function replaceActiveSizeVariation(
	className: string,
	_activeSizeVariation?: Object | null,
	newSizeVariation?: Object | null,
	event: 'click' | 'detach' = 'click'
): string {
	const list = new TokenList(className || '');
	const p = BLOCK_SIZE_VARIATION_CLASS_PREFIX;

	for (const token of [...list.values()]) {
		if (token.indexOf(p) === 0) {
			list.remove(token);
		}
	}

	if ('detach' === event) {
		return list.value;
	}

	const slug = newStyleVariationSlug(
		newStyleVariationMaybe(newSizeVariation)
	);

	if (!slug) {
		return list.value;
	}

	list.add(p + slug);

	return list.value;
}

function newStyleVariationMaybe(v: mixed): Object | null {
	if (v && typeof v === 'object' && v !== null) {
		return v;
	}

	return null;
}

function newStyleVariationSlug(style: Object | null): ?string {
	if (!style?.name || typeof style.name !== 'string') {
		return null;
	}

	return style.name;
}

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/utils'
 *
 * Returns a collection of styles that can be represented on the frontend.
 * The function checks a style collection for a default style. If none is found, it adds one to
 * act as a fallback for when there is no active style applied to a block. The default item also serves
 * as a switch on the frontend to deactivate non-default styles.
 *
 * @param {Array} styles - The styles array.
 * @param {Array} baseVariations - Base theme variations.
 * @param {string} blockName - The block type name.
 * @param {boolean} [inGlobalStylesPanel=false] - When true, includes disabled items (for panel). When false, filters out disabled items (for block inspector).
 */
export function getRenderedStyles(
	styles: Array<any>,
	baseVariations: Array<Object>,
	blockName: string,
	inGlobalStylesPanel: boolean = false
): Array<Object> {
	const defaultGlobalStyle = {
		name: 'default',
		label: _x('Default', 'block style', 'blockera'),
		isDefault: true,
		icon: {
			name: 'wordpress',
			library: 'wp',
		},
	};
	const blockeraGlobalStylesMetaData = getBlockeraGlobalStylesMetaData();
	const variations =
		blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations || {};

	if (!styles || styles.length === 0) {
		return [defaultGlobalStyle];
	}

	styles = styles
		.map((style) => {
			if (variations[style.name]?.isDeleted) {
				return null;
			}

			// Outside global styles panel: do not render disabled items
			if (
				!inGlobalStylesPanel &&
				variations[style.name]?.hasOwnProperty('status') &&
				!variations[style.name].status
			) {
				return null;
			}

			if (style.name in variations) {
				return {
					...style,
					label: variations[style.name].label,
					// $FlowFixMe
					...(variations[style.name].isDefault
						? { isDefault: true }
						: {}),
					...(variations[style.name].isDeleted &&
					style.name in baseVariations
						? { name: variations[style.name].name }
						: {}),
				};
			}

			return style;
		})
		.filter(Boolean);
	styles = [...(styles || [])].sort((a, b) => {
		if (a?.isDefault) {
			return -1;
		}
		if (b?.isDefault) {
			return 1;
		}
		return 0;
	});

	const normalizeStyle = (style: Object): Object => {
		if (style?.icon) {
			return style;
		}

		if (style.name in baseVariations || style.isDefault) {
			return {
				...style,
				icon: {
					name: 'wordpress',
					library: 'wp',
				},
			};
		}

		return {
			...style,
			icon: {
				name: 'blockera',
				library: 'blockera',
			},
		};
	};

	return getDefaultStyle(styles)
		? styles.map(normalizeStyle)
		: [defaultGlobalStyle, ...styles.map(normalizeStyle)];
}

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/utils'
 *
 * Returns a style object from a collection of styles where that style object is the default block style.
 */
export function getDefaultStyle(styles: Array<Object>): Object {
	return styles?.find((style) => style.isDefault);
}

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/use-styles-for-block'
 *
 * @param {boolean} [inGlobalStylesPanel=false] - When true, includes disabled items (for panel). When false, filters out disabled items (for block inspector).
 */
export function useStylesForBlocks({
	event,
	clientId,
	onSwitch,
	blockName,
	inGlobalStylesPanel = false,
}: {
	clientId: string,
	blockName: string,
	onSwitch: () => void,
	event: 'click' | 'detach',
	inGlobalStylesPanel?: boolean,
}): Object {
	const selector = (select: any) => {
		const { getBlock } = select(blockEditorStore);
		let block = getBlock(clientId);

		if (!block) {
			block = {
				name: blockName,
				attributes: {
					className: '',
				},
			};
		}
		const blockType = getBlockType(block.name);
		const { getBlockStyles } = select(blocksStore);

		return {
			block,
			blockType,
			styles: getBlockStyles(block.name),
			className: block.attributes.className || '',
		};
	};
	const { styles, block, blockType, className } = useSelect(selector, [
		clientId,
		blockName,
	]);
	const base = select('core').__experimentalGetCurrentThemeBaseGlobalStyles();

	const { updateBlockAttributes } = useDispatch(blockEditorStore);
	const stylesToRender = useMemo(
		() =>
			getRenderedStyles(
				styles,
				prepare(`styles.blocks.${blockName}.variations`, base) || {},
				blockName,
				inGlobalStylesPanel
			),
		[base, styles, blockName, inGlobalStylesPanel]
	);
	const activeStyle = useMemo(
		() => getActiveStyle(stylesToRender, className),
		[stylesToRender, className]
	);
	const genericPreviewBlock = useGenericPreviewBlock(block, blockType);

	const isDeletedStyle = isString(activeStyle) ? activeStyle : false;

	const onSelect = useCallback(
		(newStyle: string) => {
			const styleClassName = replaceActiveStyle(
				className,
				isString(isDeletedStyle)
					? {
							name: isDeletedStyle,
							label: isDeletedStyle,
							isDefault: false,
							isDeleted: true,
						}
					: activeStyle,
				newStyle,
				event
			);
			updateBlockAttributes(clientId, {
				className: styleClassName,
			});
			onSwitch();
		},
		[
			event,
			clientId,
			onSwitch,
			className,
			activeStyle,
			isDeletedStyle,
			updateBlockAttributes,
		]
	);

	return {
		onSelect,
		stylesToRender,
		activeStyle: isDeletedStyle
			? getDefaultStyle(stylesToRender)
			: activeStyle,
		genericPreviewBlock,
		className,
		isDeletedStyle,
	};
}

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/use-styles-for-block'
 *
 */
export function useGenericPreviewBlock(
	block: Object,
	type: Object,
	skipHeavyClone: boolean = false
): Object {
	return useMemo(() => {
		if (skipHeavyClone) {
			let nm = '';
			if (typeof block?.name === 'string') {
				nm = block.name;
			} else if (typeof type?.name === 'string') {
				nm = type.name;
			}
			return {
				name: nm,
				attributes: {},
				innerBlocks: [],
			};
		}

		const example = type?.example;
		const blockName = type?.name;

		if (example && blockName) {
			return getBlockFromExample(blockName, {
				attributes: example.attributes,
				innerBlocks: example.innerBlocks,
			});
		}

		if (block) {
			if (!block.hasOwnProperty('innerBlocks')) {
				block.innerBlocks = [];
			}

			return cloneBlock(block);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skipHeavyClone, type?.example ? block?.name : block, type]);
}

/**
 * Normalize a style/size variation ID while typing.
 * Preserves a trailing hyphen (e.g. `style-` when deleting the numeric suffix of `style-1`).
 *
 * @param {string} value Raw ID input.
 * @return {string} Lowercase kebab-case slug.
 */
export function sanitizeStyleVariationId(value: string): string {
	return kebabCase(value.toLowerCase().trim(), {
		suffixCharacters: '-',
	});
}

/**
 * Generate unique hash for style variation based on base64 algorithm for encoding string.
 *
 * @return {string} generated unique hash for style variation.
 */
export function generateUniqueStyleVariationHash(): string {
	const encoder: Object = new TextEncoder().encode(
		`style-${Math.floor(Math.random() * 900) + 100}`
	);

	return encoder.toBase64();
}
