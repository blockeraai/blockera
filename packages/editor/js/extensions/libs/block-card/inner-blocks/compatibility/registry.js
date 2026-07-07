// @flow

/**
 * Blockera dependencies
 */
import { isBorderEmpty, isBorderRadiusEmpty } from '@blockera/controls';
import { boxSpacingControlDefaultValue } from '@blockera/controls/js/libs/box-spacing-control/utils';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	fontFamilyFromWPCompatibility,
	fontFamilyToWPCompatibility,
} from '../../../typography/compatibility/font-family';
import {
	fontSizeFromWPCompatibility,
	fontSizeToWPCompatibility,
} from '../../../typography/compatibility/font-size';
import {
	lineHeightFromWPCompatibility,
	lineHeightToWPCompatibility,
} from '../../../typography/compatibility/line-height';
import {
	textDecorationFromWPCompatibility,
	textDecorationToWPCompatibility,
} from '../../../typography/compatibility/text-decoration';
import {
	fontAppearanceFromWPCompatibility,
	fontAppearanceToWPCompatibility,
} from '../../../typography/compatibility/font-appearance';
import {
	textTransformFromWPCompatibility,
	textTransformToWPCompatibility,
} from '../../../typography/compatibility/text-transform';
import {
	letterSpacingFromWPCompatibility,
	letterSpacingToWPCompatibility,
} from '../../../typography/compatibility/letter-spacing';
import {
	textOrientationFromWPCompatibility,
	textOrientationToWPCompatibility,
} from '../../../typography/compatibility/text-orientation';
import {
	textAlignFromWPCompatibility,
	textAlignToWPCompatibility,
} from '../../../typography/compatibility/text-align';
import {
	borderFromWPCompatibility,
	borderToWPCompatibility,
} from '../../../border-and-shadow/compatibilities/border';
import {
	borderRadiusFromWPCompatibility,
	borderRadiusToWPCompatibility,
} from '../../../border-and-shadow/compatibilities/border-radius';
import {
	shadowFromWPCompatibility,
	shadowToWPCompatibility,
} from '../../../border-and-shadow/compatibilities/shadow';
import {
	spacingFromWPCompatibility,
	spacingToWPCompatibility,
} from '../../../layout/compatibility/spacing';
import {
	gapFromWPCompatibility,
	gapToWPCompatibility,
} from '../../../layout/compatibility/gap';
import {
	minHeightFromWPCompatibility,
	minHeightToWPCompatibility,
} from '../../../size/compatibility/min-height';
import {
	ratioFromWPCompatibility,
	ratioToWPCompatibility,
} from '../../../size/compatibility/aspect-ratio';
import {
	customCssFromWPCompatibility,
	customCssToWPCompatibility,
} from '../../../custom-style/compatibility/custom-css';
import {
	BLOCKERA_BORDER_COMPAT_KEYS,
	ELEMENT_SPECIAL_COMPAT_KEYS,
	INNER_BLOCK_FEATURE_REFS,
	INNER_BLOCK_PSEUDO_DEDICATED_COMPAT_KEYS,
	INNER_BLOCK_WP_ELEMENT_PSEUDO_STATES,
	WP_BORDER_STYLE_PROPERTY_KEYS,
	resolveInnerBlockCompatGateKey,
} from './element-schema';
import type { ElementCompatState } from './element-scope';

export type InnerBlockCompatEntry = {
	key: string,
	/** Blockera control attribute id (mirror target). */
	featureId: string,
	/** theme.json element path (dot notation from element node). */
	wpFeatureId: string,
	state: ElementCompatState,
	styleSources: Array<string>,
	/** Merge `wpFeatureId` compat values into existing `featureId` on import. */
	mergesIntoBlockeraFeature?: boolean,
	needsBlockId?: boolean,
	/**
	 * True when the Blockera mirror has no user value (import from WP is allowed).
	 * Only inspects `featureId` on inner-block attribute bags.
	 */
	isBlockeraEmpty: (innerBlockAttributes: Object) => boolean,
	fromWP: (args: Object) => Object,
	toWP: (args: Object) => Object,
};

export const SPECIAL_INNER_BLOCK_COMPAT_KEYS: Array<string> =
	ELEMENT_SPECIAL_COMPAT_KEYS;

const defaultGap = {
	lock: true,
	gap: '',
	columns: '',
	rows: '',
};

export const getNestedValue = (object: Object, path: string): any => {
	return path.split('.').reduce((current, segment) => {
		if (current === undefined || current === null) {
			return undefined;
		}

		return current[segment];
	}, object);
};

const isVacantValue = (value: any): boolean => {
	if (value === undefined || value === null || value === '') {
		return true;
	}

	if (typeof value === 'object') {
		return Object.keys(value).length === 0;
	}

	return false;
};

/**
 * Whether a theme.json feature path is unset on an element style node.
 */
export const isWpElementFeatureUnset = (
	elementStyle: Object,
	wpFeatureId: string
): boolean => {
	if (!elementStyle || typeof elementStyle !== 'object') {
		return true;
	}

	return isVacantValue(getNestedValue(elementStyle, wpFeatureId));
};

/**
 * Whether the mapped theme.json path has a value on the element style node.
 */
export const isWpElementFeaturePopulated = (
	elementStyle: Object,
	wpFeatureId: string
): boolean => {
	return !isWpElementFeatureUnset(elementStyle, wpFeatureId);
};

const isWpBorderSidePopulated = (border: Object): boolean => {
	return ['top', 'right', 'bottom', 'left'].some((side) => {
		const sideData = border?.[side];

		if (!sideData || typeof sideData !== 'object') {
			return false;
		}

		return WP_BORDER_STYLE_PROPERTY_KEYS.filter((key) =>
			['color', 'style', 'width'].includes(key)
		).some((propertyKey) => !isVacantValue(sideData[propertyKey]));
	});
};

/**
 * Whether theme.json border data can sync to `blockeraBorder` (flat or per-side).
 */
export const isWpBorderFeaturePopulated = (
	elementStyle: Object,
	wpFeatureId: string
): boolean => {
	if (isWpElementFeaturePopulated(elementStyle, wpFeatureId)) {
		return true;
	}

	const border = elementStyle?.border;

	if (!border || typeof border !== 'object') {
		return false;
	}

	return isWpBorderSidePopulated(border);
};

/**
 * Whether the Blockera mirror attribute is empty / default.
 */
export const isBlockeraMirrorEmpty = (
	innerBlockAttributes: Object,
	blockeraFeatureId: string
): boolean => {
	const feature = innerBlockAttributes?.[blockeraFeatureId];

	if (blockeraFeatureId === 'blockeraFontAppearance') {
		return isEquals(feature?.value, {
			weight: '',
			style: '',
		});
	}

	if (blockeraFeatureId === 'blockeraBorder') {
		return isBorderEmpty(feature?.value);
	}

	if (blockeraFeatureId === 'blockeraBorderRadius') {
		return isBorderRadiusEmpty(feature?.value);
	}

	if (blockeraFeatureId === 'blockeraSpacing') {
		return isEquals(feature?.value, boxSpacingControlDefaultValue);
	}

	if (blockeraFeatureId === 'blockeraBoxShadow') {
		return Object.keys(feature?.value || {}).length === 0;
	}

	if (blockeraFeatureId === 'blockeraGap') {
		return isEquals(feature?.value, defaultGap);
	}

	if (blockeraFeatureId === 'blockeraCustomCSS') {
		const value = feature?.value;

		return (
			!value ||
			value === '' ||
			(typeof value === 'string' && value.trim() === '') ||
			value === '& {\n    \n}\n'
		);
	}

	if (blockeraFeatureId === 'blockeraRatio') {
		return (
			feature?.value?.val === '' ||
			feature?.value?.value === '' ||
			feature?.value === '' ||
			feature?.value === undefined
		);
	}

	if (blockeraFeatureId === 'blockeraMinHeight') {
		return feature?.value === '' || feature?.value === undefined;
	}

	return feature?.value === '' || feature?.value === undefined;
};

/**
 * @param {string} blockeraFeatureId Blockera mirror attribute id.
 */
export const createIsBlockeraEmpty = (
	blockeraFeatureId: string
): ((innerBlockAttributes: Object) => boolean) => {
	return (innerBlockAttributes: Object): boolean => {
		return isBlockeraMirrorEmpty(innerBlockAttributes, blockeraFeatureId);
	};
};

const compatHandlersByKey: {
	[string]: {
		fromWP: (args: Object) => Object,
		toWP: (args: Object) => Object,
		needsBlockId?: boolean,
	},
} = {
	'font-family': {
		fromWP: fontFamilyFromWPCompatibility,
		toWP: fontFamilyToWPCompatibility,
	},
	'font-size': {
		fromWP: fontSizeFromWPCompatibility,
		toWP: fontSizeToWPCompatibility,
	},
	'line-height': {
		fromWP: lineHeightFromWPCompatibility,
		toWP: lineHeightToWPCompatibility,
	},
	'text-align': {
		fromWP: textAlignFromWPCompatibility,
		toWP: textAlignToWPCompatibility,
		needsBlockId: true,
	},
	'text-decoration': {
		fromWP: textDecorationFromWPCompatibility,
		toWP: textDecorationToWPCompatibility,
	},
	'text-decoration-hover': {
		fromWP: textDecorationFromWPCompatibility,
		toWP: textDecorationToWPCompatibility,
	},
	'font-appearance': {
		fromWP: fontAppearanceFromWPCompatibility,
		toWP: fontAppearanceToWPCompatibility,
	},
	'text-transform': {
		fromWP: textTransformFromWPCompatibility,
		toWP: textTransformToWPCompatibility,
	},
	'letter-spacing': {
		fromWP: letterSpacingFromWPCompatibility,
		toWP: letterSpacingToWPCompatibility,
	},
	'text-orientation': {
		fromWP: textOrientationFromWPCompatibility,
		toWP: textOrientationToWPCompatibility,
	},
	'border-color': {
		fromWP: borderFromWPCompatibility,
		toWP: borderToWPCompatibility,
	},
	'border-style': {
		fromWP: borderFromWPCompatibility,
		toWP: borderToWPCompatibility,
	},
	'border-width': {
		fromWP: borderFromWPCompatibility,
		toWP: borderToWPCompatibility,
	},
	'border-radius': {
		fromWP: borderRadiusFromWPCompatibility,
		toWP: borderRadiusToWPCompatibility,
	},
	'box-shadow': {
		fromWP: shadowFromWPCompatibility,
		toWP: shadowToWPCompatibility,
	},
	spacing: {
		fromWP: spacingFromWPCompatibility,
		toWP: spacingToWPCompatibility,
	},
	gap: {
		fromWP: gapFromWPCompatibility,
		toWP: gapToWPCompatibility,
	},
	'min-height': {
		fromWP: minHeightFromWPCompatibility,
		toWP: minHeightToWPCompatibility,
		needsBlockId: true,
	},
	'aspect-ratio': {
		fromWP: ratioFromWPCompatibility,
		toWP: ratioToWPCompatibility,
		needsBlockId: true,
	},
	'custom-css': {
		fromWP: customCssFromWPCompatibility,
		toWP: customCssToWPCompatibility,
	},
};

const stateByCompatKey: { [string]: ElementCompatState } = {
	'text-decoration-hover': 'hover',
};

const buildRegistryEntry = (
	ref: (typeof INNER_BLOCK_FEATURE_REFS)[number]
): InnerBlockCompatEntry => {
	const handlers = compatHandlersByKey[ref.key];

	return {
		key: ref.key,
		featureId: ref.blockeraFeatureId,
		wpFeatureId: ref.wpFeatureId,
		state: stateByCompatKey[ref.key] || 'normal',
		styleSources: ref.styleSources,
		mergesIntoBlockeraFeature: ref.mergesIntoBlockeraFeature,
		needsBlockId: handlers?.needsBlockId,
		isBlockeraEmpty: createIsBlockeraEmpty(ref.blockeraFeatureId),
		fromWP: handlers.fromWP,
		toWP: handlers.toWP,
	};
};

const baseInnerBlockCompatRegistry: Array<InnerBlockCompatEntry> =
	INNER_BLOCK_FEATURE_REFS.map(buildRegistryEntry);

const expandRegistryWithWpPseudoStates = (
	entries: Array<InnerBlockCompatEntry>
): Array<InnerBlockCompatEntry> => {
	const pseudoEntries: Array<InnerBlockCompatEntry> = [];

	INNER_BLOCK_WP_ELEMENT_PSEUDO_STATES.forEach((pseudoState) => {
		const blockState: ElementCompatState =
			pseudoState === 'hover' ? 'hover' : 'normal';

		if (blockState === 'normal') {
			return;
		}

		entries.forEach((entry) => {
			if (entry.state !== 'normal') {
				return;
			}

			if (INNER_BLOCK_PSEUDO_DEDICATED_COMPAT_KEYS.includes(entry.key)) {
				return;
			}

			pseudoEntries.push({
				...entry,
				state: blockState,
			});
		});
	});

	return [...entries, ...pseudoEntries];
};

export const INNER_BLOCK_COMPAT_REGISTRY: Array<InnerBlockCompatEntry> =
	expandRegistryWithWpPseudoStates(baseInnerBlockCompatRegistry);

const blockStateToElementState: { [string]: ElementCompatState } = {
	hover: 'hover',
	focus: 'focus',
	active: 'active',
	visited: 'visited',
};

export const getRegistryEntryForSetAttributes = (
	featureId: string,
	currentState: string,
	dataCompatibility: Array<string>,
	registry: Array<InnerBlockCompatEntry> = INNER_BLOCK_COMPAT_REGISTRY
): ?InnerBlockCompatEntry => {
	const state: ElementCompatState =
		blockStateToElementState[currentState] || 'normal';

	return (
		registry.find(
			(item) =>
				item.featureId === featureId &&
				item.state === state &&
				dataCompatibility.includes(
					resolveInnerBlockCompatGateKey(item.key)
				)
		) || null
	);
};

/**
 * Whether WP element data can be imported into Blockera for this registry entry.
 */
export const canImportFromWpElement = (
	innerBlockAttributes: Object,
	elementStyle: Object,
	entry: InnerBlockCompatEntry
): boolean => {
	const isWpPopulated = BLOCKERA_BORDER_COMPAT_KEYS.includes(entry.key)
		? isWpBorderFeaturePopulated(elementStyle, entry.wpFeatureId)
		: isWpElementFeaturePopulated(elementStyle, entry.wpFeatureId);

	return entry.isBlockeraEmpty(innerBlockAttributes) && isWpPopulated;
};
