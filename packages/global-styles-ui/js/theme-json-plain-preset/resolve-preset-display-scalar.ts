/**
 * Blockera dependencies
 */
import {
	inferPresetCssVarInfixForPaintVariablePickerType,
	resolvePlainThemeJsonPresetSlugValueFromWpEditor,
	resolveThemeJsonPaintPresetStringFromWpEditor,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import { plainPresetSlugFromStoredPlainPresetInput } from './composite-plain-preset';

const PAINT_CSS_VAR_INFICES = new Set(['color', 'gradient']);

export type ResolveThemeJsonPresetScalarForGlobalStylesUiArgs = {
	storedScalar: string;
	presetSlug: string;
	blockName?: string;
	presetCssVarInfix: string;
	variablePickerType?: string;
};

/**
 * Resolves a persisted preset row field for swatches, previews, and headers: handles `var:preset|…`,
 * `var(--wp--preset--…)`, plain slugs, and composite `{resolved},{slug}` strings (via slug inference).
 *
 * Paint buckets (`color`, `gradient`) use {@link resolveThemeJsonPaintPresetStringFromWpEditor}.
 * Other buckets use slug resolution against merged editor features.
 */
export function resolveThemeJsonPresetScalarForGlobalStylesUi(
	args: ResolveThemeJsonPresetScalarForGlobalStylesUiArgs
): string {
	const blockName = typeof args.blockName === 'string' ? args.blockName : '';
	const infix =
		typeof args.presetCssVarInfix === 'string'
			? args.presetCssVarInfix
			: '';

	const pickerBucketHint = inferPresetCssVarInfixForPaintVariablePickerType(
		args.variablePickerType
	);

	const usePaintResolver =
		PAINT_CSS_VAR_INFICES.has(infix) ||
		(typeof pickerBucketHint === 'string' &&
			PAINT_CSS_VAR_INFICES.has(pickerBucketHint));

	if (usePaintResolver) {
		return resolveThemeJsonPaintPresetStringFromWpEditor({
			value: args.storedScalar,
			presetSlug: args.presetSlug,
			blockName,
			presetCssVarInfix: infix || pickerBucketHint,
			variablePickerType: args.variablePickerType,
		});
	}

	const slug =
		args.presetSlug ||
		plainPresetSlugFromStoredPlainPresetInput(args.storedScalar.trim());

	const leaf = resolvePlainThemeJsonPresetSlugValueFromWpEditor(
		slug,
		blockName,
		infix
	);

	if (typeof leaf === 'string') {
		return leaf;
	}
	if (leaf === undefined || leaf === null) {
		return '';
	}
	return String(leaf);
}
