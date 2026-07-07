/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import { __experimentalVStack as VStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	VarPickerPresetContext,
	useVarPickerPresetContext,
} from '@blockera/controls';
import type { VariableItem } from '@blockera/data';
import { noop, pascalCase } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { FallbackPresetFields } from './fallback-preset-fields';
import { FallbackPresetOpener } from './fallback-preset-opener';
import {
	shouldShowDefaultPresetGroupInVariablePicker,
	shouldShowThemePresetGroup,
} from './preset-origin-utils';
import { PresetGroup } from './preset-group';
import { WidthSizePresetOpener } from '../width-size/width-size-preset-opener';

function partitionCatalogItems(items: VariableItem[]): {
	theme: VariableItem[];
	defaultItems: VariableItem[];
} {
	const theme: VariableItem[] = [];
	const defaultItems: VariableItem[] = [];

	for (const item of items) {
		if (item.reference?.type === 'theme') {
			theme.push(item);
		} else {
			defaultItems.push(item);
		}
	}

	return { theme, defaultItems };
}

function toRepeaterVariables(
	items: VariableItem[],
	variableType: string
): Record<string, VariableItem & Record<string, unknown>> {
	const sorted = [...items].sort((a, b) =>
		String(a.name).localeCompare(String(b.name))
	);
	const out: Record<string, VariableItem & Record<string, unknown>> = {};

	sorted.forEach((item, index) => {
		const slug = String(item.id);
		const key = `${variableType}-fallback-${slug}`;
		out[key] = {
			...item,
			slug,
			name: item.name,
			order: index + 1,
			isVisible: true,
			selectable: true,
			deletable: false,
			cloneable: false,
			visibilitySupport: false,
		};
	});

	return out;
}

const FALLBACK_DEFAULT_PRESET = {
	slug: '',
	name: '',
	deletable: false,
	cloneable: false,
	visibilitySupport: false,
} as const;

function VarPickerFallbackReadOnlyProvider({
	children,
}: {
	children: ReactNode;
}) {
	const ctx = useVarPickerPresetContext();

	return (
		<VarPickerPresetContext.Provider
			value={{
				...ctx,
				disablePresetRowEdit: true,
				omitRepeaterSectionLabel: true,
			}}
		>
			{children}
		</VarPickerPresetContext.Provider>
	);
}

/**
 * Catalog variables in the block picker when no global-styles preset editor exists for the type.
 * Renders theme and default sections via {@link PresetGroup} (read-only: no “add new”, same as
 * non-custom origins in full preset editors).
 */
export function FallbackPresetContent() {
	const {
		controlProps,
		variableType,
		catalogItems = [],
		catalogLabel,
	} = useVarPickerPresetContext();

	const effectiveType = variableType ?? '';

	const { theme, defaultItems } = useMemo(
		() => partitionCatalogItems(catalogItems),
		[catalogItems]
	);

	const themeVariables = useMemo(
		() => toRepeaterVariables(theme, effectiveType),
		[theme, effectiveType]
	);
	const defaultVariables = useMemo(
		() => toRepeaterVariables(defaultItems, effectiveType),
		[defaultItems, effectiveType]
	);

	if (!controlProps || !variableType) {
		return null;
	}

	if (!catalogItems.length) {
		return (
			<span style={{ opacity: '0.5', fontSize: '12px' }}>
				{__(
					'This variable type is not available in this context.',
					'blockera'
				)}
			</span>
		);
	}

	const defaultLayerEnabled = true;
	const showThemeOriginGroup =
		shouldShowThemePresetGroup(
			defaultLayerEnabled,
			theme.length,
			defaultItems.length
		) && theme.length > 0;
	const showDefaultOriginGroup =
		shouldShowDefaultPresetGroupInVariablePicker(
			defaultLayerEnabled,
			theme.length,
			defaultItems.length
		) && defaultItems.length > 0;

	const title =
		catalogLabel && String(catalogLabel).trim() !== ''
			? catalogLabel
			: pascalCase(effectiveType);

	const catalogRepeaterItemHeader =
		effectiveType === 'width-size'
			? WidthSizePresetOpener
			: FallbackPresetOpener;

	return (
		<VarPickerFallbackReadOnlyProvider>
			<VStack
				spacing={8}
				className="global-styles-ui-fallback-catalog-panel"
			>
				{showThemeOriginGroup && (
					<PresetGroup
						repeaterItemHeader={catalogRepeaterItemHeader}
						onChange={noop}
						controlName={`fallback-catalog-theme-${variableType}`}
						defaultPresetValue={FALLBACK_DEFAULT_PRESET}
						origin="theme"
						variables={themeVariables as never}
						PresetFields={FallbackPresetFields}
						title={title}
						label=""
						enableCreatingStep={false}
					/>
				)}
				{showDefaultOriginGroup && (
					<PresetGroup
						repeaterItemHeader={catalogRepeaterItemHeader}
						onChange={noop}
						controlName={`fallback-catalog-default-${variableType}`}
						defaultPresetValue={FALLBACK_DEFAULT_PRESET}
						origin="default"
						variables={defaultVariables as never}
						PresetFields={FallbackPresetFields}
						title={title}
						label=""
						enableCreatingStep={false}
					/>
				)}
			</VStack>
		</VarPickerFallbackReadOnlyProvider>
	);
}
