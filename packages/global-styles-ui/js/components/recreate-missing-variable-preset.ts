/**
 * Blockera dependencies
 */
import { setImmutably } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getValueFromObjectPath } from '../theme-json-utils';
import {
	buildMissingVariableRecreatePreset,
	normalizeMissingVariablePresetSlug,
	type MissingVariableSettings,
} from './missing-variable-recreate-preset-utils';

export type RecreateMissingVariableResult =
	| { ok: true; slug: string }
	| { ok: false; reason: 'invalid' | 'duplicate' | 'unsupported' };

const CUSTOM_PRESET_PATH_BY_TYPE: Record<string, string> = {
	'font-size': 'settings.typography.fontSizes.custom',
	'line-height': 'settings.typography.lineHeights.custom',
	color: 'settings.color.palette.custom',
	spacing: 'settings.spacing.spacingSizes.custom',
	'width-size': 'settings.layout.widthSizes.custom',
	'border-radius': 'settings.border.radiusSizes.custom',
	border: 'settings.border.presets.custom',
	shadow: 'settings.shadow.presets.custom',
	'text-shadow': 'settings.textShadow.presets.custom',
	transform: 'settings.transform.presets.custom',
	transition: 'settings.transition.presets.custom',
	filter: 'settings.filter.presets.custom',
	'linear-gradient': 'settings.color.gradients.custom',
	'radial-gradient': 'settings.color.gradients.custom',
};

function readCustomPresets(
	config: Record<string, unknown>,
	path: string
): Record<string, unknown>[] {
	const value = getValueFromObjectPath(config, path);
	return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

export type RecreateMissingVariablePresetArgs = {
	variableType: string;
	settings: MissingVariableSettings;
	setUserConfig: (
		updater: (current: Record<string, unknown>) => Record<string, unknown>
	) => void;
	getUserConfig: () => Record<string, unknown>;
};

/**
 * Append a custom global-styles preset recreated from a missing variable binding.
 */
export function recreateMissingVariablePreset({
	variableType,
	settings,
	setUserConfig,
	getUserConfig,
}: RecreateMissingVariablePresetArgs): RecreateMissingVariableResult {
	const presetPath = CUSTOM_PRESET_PATH_BY_TYPE[variableType];
	if (!presetPath) {
		return { ok: false, reason: 'unsupported' };
	}

	const presetRow = buildMissingVariableRecreatePreset(
		variableType,
		settings
	);
	if (!presetRow) {
		return { ok: false, reason: 'invalid' };
	}

	const slug = normalizeMissingVariablePresetSlug(String(settings.id ?? ''));
	const currentConfig = getUserConfig();
	const existing = readCustomPresets(currentConfig, presetPath);
	const hasDuplicate = existing.some(
		(row) =>
			normalizeMissingVariablePresetSlug(String(row.slug ?? '')) === slug
	);

	if (hasDuplicate) {
		return { ok: false, reason: 'duplicate' };
	}

	const nextPresets = [...existing, presetRow];
	const pathParts = presetPath.split('.');

	setUserConfig((configDraft) =>
		setImmutably(configDraft, pathParts, nextPresets)
	);

	return { ok: true, slug };
}
