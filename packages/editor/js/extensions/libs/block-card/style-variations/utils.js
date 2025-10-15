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

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/utils'
 *
 * Returns the active style from the given className.
 */
export function getActiveStyle(styles: Array<any>, className: string): Object {
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
	}

	return getDefaultStyle(styles);
}

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/utils'
 * but the BlockCard section edited (used exact code)
 *
 * Replaces the active style in the block's className.
 */
export function replaceActiveStyle(
	className: string,
	activeStyle: Object,
	newStyle: Object
): string {
	const list = new TokenList(className);

	if (activeStyle) {
		list.remove('is-style-' + activeStyle.name);
	}

	list.add('is-style-' + newStyle.name);

	return list.value;
}

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/utils'
 *
 * Returns a collection of styles that can be represented on the frontend.
 * The function checks a style collection for a default style. If none is found, it adds one to
 * act as a fallback for when there is no active style applied to a block. The default item also serves
 * as a switch on the frontend to deactivate non-default styles.
 */
export function getRenderedStyles(
	styles: Array<any>,
	baseVariations: Array<Object>,
	blockName: string
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
	const { blockeraGlobalStylesMetaData } = window;
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
		if (a?.isDefault) return -1;
		if (b?.isDefault) return 1;
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
 */
export function useStylesForBlocks({
	clientId,
	onSwitch,
	blockName,
}: {
	clientId: string,
	blockName: string,
	onSwitch: () => void,
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
	const stylesToRender = getRenderedStyles(
		styles,
		prepare(`styles.blocks.${blockName}.variations`, base) || {},
		blockName
	);
	const activeStyle = useMemo(
		() => getActiveStyle(stylesToRender, className),
		[stylesToRender, className]
	);
	const genericPreviewBlock = useGenericPreviewBlock(block, blockType);

	const onSelect = useCallback(
		(style: string) => {
			const styleClassName = replaceActiveStyle(
				className,
				activeStyle,
				style
			);
			updateBlockAttributes(clientId, {
				className: styleClassName,
			});
			onSwitch();
		},
		[clientId, className, activeStyle, onSwitch, updateBlockAttributes]
	);

	return {
		onSelect,
		stylesToRender,
		activeStyle,
		genericPreviewBlock,
		className,
	};
}

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/use-styles-for-block'
 *
 */
function useGenericPreviewBlock(block: Object, type: Object) {
	return useMemo(() => {
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
	}, [type?.example ? block?.name : block, type]);
}
