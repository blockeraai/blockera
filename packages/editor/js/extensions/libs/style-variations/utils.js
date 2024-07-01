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
import { useDispatch, useSelect } from '@wordpress/data';
import TokenList from '@wordpress/token-list';
import { _x } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

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
export function getRenderedStyles(styles: Array<any>): Array<Object> {
	if (!styles || styles.length === 0) {
		return [];
	}

	return getDefaultStyle(styles)
		? styles
		: [
				{
					name: 'default',
					label: _x('Default', 'block style', 'blockera'),
					isDefault: true,
				},
				...styles,
		  ];
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
}: {
	clientId: string,
	onSwitch: () => void,
}): Object {
	const selector = (select: any) => {
		const { getBlock } = select(blockEditorStore);
		const block = getBlock(clientId);

		if (!block) {
			return {};
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
	]);
	const { updateBlockAttributes } = useDispatch(blockEditorStore);
	const stylesToRender = getRenderedStyles(styles);
	const activeStyle = getActiveStyle(stylesToRender, className);
	const genericPreviewBlock = useGenericPreviewBlock(block, blockType);

	const onSelect = (style: string) => {
		const styleClassName = replaceActiveStyle(
			className,
			activeStyle,
			style
		);
		updateBlockAttributes(clientId, {
			className: styleClassName,
		});
		onSwitch();
	};

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
			return cloneBlock(block);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type?.example ? block?.name : block, type]);
}
