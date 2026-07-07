import type { PresetVariablesOriginSet } from './count-preset-variables';

export function buildVisiblePresetOriginSets<
	T extends Record<string, unknown>,
>({
	showThemeOriginGroup,
	showDefaultOriginGroup,
	themeItems,
	themeBaseItems,
	defaultItems,
	defaultBaseItems,
	customItems,
	presetKind = 'default',
}: {
	showThemeOriginGroup: boolean;
	showDefaultOriginGroup: boolean;
	themeItems: T[];
	themeBaseItems?: T[];
	defaultItems: T[];
	defaultBaseItems?: T[];
	customItems: T[];
	presetKind?: 'color' | 'default';
}): Array<PresetVariablesOriginSet<T>> {
	const sets: Array<PresetVariablesOriginSet<T>> = [];

	if (showThemeOriginGroup) {
		sets.push({
			items: themeItems,
			baseItems: themeBaseItems,
			presetKind,
		});
	}

	if (showDefaultOriginGroup) {
		sets.push({
			items: defaultItems,
			baseItems: defaultBaseItems,
			presetKind,
		});
	}

	sets.push({
		items: customItems,
		presetKind,
	});

	return sets;
}
