// @flow

/**
 * Blockera dependencies
 */
import { kebabCase } from '@blockera/utils';

export const DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME =
	'blockera-style-variation-block-card';

export function getStyleVariationBlockCardSlotNames(
	slotNamespace: string,
	variationName: string
): {|
	menu: string,
	afterPreview: string,
	children: string,
|} {
	const key = variationName ?? '';
	const kebabVariation = kebabCase(key);

	const children =
		slotNamespace === DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME
			? `blockera-${kebabVariation}-style-variation-block-card-children`
			: `${slotNamespace}-children-${kebabVariation}`;

	return {
		menu: `${slotNamespace}-menu-${key}`,
		afterPreview: `${slotNamespace}-after-preview-${key}`,
		children,
	};
}
