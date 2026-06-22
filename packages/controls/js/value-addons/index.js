// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, useSelect } from '@wordpress/data';
import { useState, useMemo, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isObject, isUndefined } from '@blockera/utils';
import {
	STORE_NAME,
	getVariable,
	type VariableItem,
	type VariableCategory,
	type DynamicValueItem,
	wrapExperimentalFeaturesRaw,
	isThemeJsonVariableDefinedInMergedFeatures,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import {
	isValid,
	extractCssVarValue,
	isLikelyThemeJsonPlainPresetSlugString,
	hasExplicitPlainThemeJsonPresetStorage,
	compositePlainColorPaintFromStoredPlainPresetInput,
	plainPresetSlugFromStoredPlainPresetInput,
	unlinkPlainThemeJsonPresetCompositeToScalar,
} from './utils';
import { canUnlinkVariable } from './helpers';
import { applyRegisteredPresetPreviewPickerMerge } from './preset-preview-picker-props-registry';
import { ValueAddonControl, ValueAddonPointer } from './components';
import type { UseValueAddonProps, ValueAddonProps } from './types';
import type { ValueAddonControlProps } from './components/control/types';

export * from './types';
export type { ValueAddonControlProps } from './components/control/types';

export const useValueAddon = (props: UseValueAddonProps): ValueAddonProps => {
	const {
		value: inputValue,
		setValue,
		onChange,
		types = [],
		size = 'normal',
		pickerProps = {},
		pointerProps = {},
		variableTypes = [],
		dynamicValueTypes = [],
	} = props;
	const presetInterface = props.presetInterface;

	const themeJsonResolutionBlockName =
		props.themeJsonResolutionBlockName ?? '';

	const normalizedVariableTypes: Array<VariableCategory> = (() => {
		if (Array.isArray(variableTypes)) {
			return variableTypes;
		}
		if (typeof variableTypes === 'string') {
			return [(variableTypes: VariableCategory)];
		}
		return [];
	})();

	const themeJsonResolutionPresetCssVarInfix =
		presetInterface?.themeJsonResolutionPresetCssVarInfix ??
		(normalizedVariableTypes.length === 1
			? normalizedVariableTypes[0]
			: undefined);

	const [isOpen, setOpen] = useState('');

	const mergedThemeJsonFeaturesWrapped = useSelect((wpSelect) => {
		try {
			const editorSettings =
				wpSelect('core/block-editor')?.getSettings?.();
			return wrapExperimentalFeaturesRaw(
				editorSettings?.__experimentalFeatures
			);
		} catch {
			return undefined;
		}
	}, []);

	const strippedRawInput = useMemo(() => {
		if (typeof inputValue !== 'string') {
			return '';
		}
		return inputValue.endsWith('func')
			? inputValue.slice(0, -4)
			: inputValue;
	}, [inputValue]);

	const effectivePlainPresetSlug = useMemo(
		() => plainPresetSlugFromStoredPlainPresetInput(strippedRawInput),
		[strippedRawInput]
	);

	const compositePlainPresetPaint = useMemo(
		() =>
			compositePlainColorPaintFromStoredPlainPresetInput(
				strippedRawInput
			),
		[strippedRawInput]
	);

	const presetResolutionCssVarInfix =
		themeJsonResolutionPresetCssVarInfix !== undefined &&
		themeJsonResolutionPresetCssVarInfix !== null &&
		String(themeJsonResolutionPresetCssVarInfix) !== ''
			? themeJsonResolutionPresetCssVarInfix
			: undefined;

	const hasPresetResolutionContextForOrphans =
		mergedThemeJsonFeaturesWrapped !== undefined &&
		mergedThemeJsonFeaturesWrapped !== null &&
		presetResolutionCssVarInfix !== undefined;

	const presetKnownInMergedThemeJson = useMemo(() => {
		if (effectivePlainPresetSlug === '') {
			return false;
		}
		return isThemeJsonVariableDefinedInMergedFeatures(
			mergedThemeJsonFeaturesWrapped,
			effectivePlainPresetSlug,
			themeJsonResolutionBlockName,
			themeJsonResolutionPresetCssVarInfix
		);
	}, [
		effectivePlainPresetSlug,
		mergedThemeJsonFeaturesWrapped,
		themeJsonResolutionBlockName,
		themeJsonResolutionPresetCssVarInfix,
	]);

	const plainSlugLooksLikeThemeJsonPreset = useMemo(() => {
		return (
			effectivePlainPresetSlug !== '' &&
			isLikelyThemeJsonPlainPresetSlugString(effectivePlainPresetSlug)
		);
	}, [effectivePlainPresetSlug]);

	const missingPlainThemeJsonPreset = useMemo(() => {
		return (
			hasPresetResolutionContextForOrphans &&
			plainSlugLooksLikeThemeJsonPreset &&
			!presetKnownInMergedThemeJson &&
			hasExplicitPlainThemeJsonPresetStorage(strippedRawInput)
		);
	}, [
		hasPresetResolutionContextForOrphans,
		plainSlugLooksLikeThemeJsonPreset,
		presetKnownInMergedThemeJson,
		strippedRawInput,
	]);

	const hasPlainThemeJsonStringValueAddon = presetKnownInMergedThemeJson;
	const effectivePickerProps = applyRegisteredPresetPreviewPickerMerge(
		pickerProps,
		presetInterface
	);

	const controlPropsRef = useRef<?ValueAddonControlProps>(null);
	const pointerPropsRef = useRef<Object>(pointerProps);
	const pickerPropsRef = useRef<Object>(effectivePickerProps);

	pointerPropsRef.current = pointerProps;
	pickerPropsRef.current = effectivePickerProps;

	const StableValueAddonPointer = useMemo(() => {
		function BoundValueAddonPointer(outerProps?: Object): MixedElement {
			const cp = controlPropsRef.current;

			if (!cp) {
				return <></>;
			}

			return (
				<ValueAddonPointer
					controlProps={cp}
					pointerProps={pointerPropsRef.current}
					pickerProps={pickerPropsRef.current}
					{...(outerProps || {})}
				/>
			);
		}

		BoundValueAddonPointer.displayName = 'useValueAddon(ValueAddonPointer)';

		return BoundValueAddonPointer;
	}, []);

	const StableValueAddonControl = useMemo(() => {
		function BoundValueAddonControl(outerProps?: Object): MixedElement {
			const cp = controlPropsRef.current;

			if (!cp) {
				return <></>;
			}

			return (
				<ValueAddonControl controlProps={cp} {...(outerProps || {})} />
			);
		}

		BoundValueAddonControl.displayName = 'useValueAddon(ValueAddonControl)';

		return BoundValueAddonControl;
	}, []);

	const value = useMemo(() => {
		return isObject(inputValue)
			? {
					isValueAddon: inputValue?.isValueAddon || false,
					valueType: inputValue?.valueType || '',
					id: inputValue?.id || '',
					settings: inputValue.settings || {},
				}
			: {
					isValueAddon: false,
					valueType: null,
					id: '',
					settings: {},
				};
	}, [inputValue]);

	// type is empty
	if (isUndefined(types) || !types.length) {
		controlPropsRef.current = null;

		return {
			isSetValueAddon: () => false,
			valueAddonClassNames: '',
			ValueAddonPointer: StableValueAddonPointer,
			ValueAddonControl: StableValueAddonControl,
			valueAddonControlProps: {
				value,
				rawValue: inputValue,
				setValue,
				onChange,
				types,
				variableTypes: normalizedVariableTypes,
				dynamicValueTypes:
					typeof dynamicValueTypes === 'string'
						? [dynamicValueTypes]
						: dynamicValueTypes,
				handleOnClickVar: () => {},
				handleOnUnlinkVar: () => {},
				handleOnClickDV: () => {},
				handleOnClickRemove: () => {},
				isOpen: '',
				setOpen: () => {},
				size,
				pickerProps: {},
				pointerProps: {},
				isDeletedVar: false,
				isDeletedPlainThemeJsonPreset: false,
				isDeletedDV: false,
				isActive: false,
				themeJsonPlainPresetCompositePaint: '',
			},
			handleOnClickVar: () => {},
			handleOnClickDV: () => {},
			handleOnUnlinkVar: () => {},
		};
	}

	const { getDynamicValue } = select(STORE_NAME);

	const valueAddonClassNames = types
		.map((type) => `blockera-value-addon-support-${type}`)
		.join(' ');

	const handleOnClickVar = (
		data: VariableItem,
		options?: { keepPickerOpen?: boolean }
	): void => {
		const newValue = {
			settings: {
				...data,
			},
			name: data.name,
			isValueAddon: true,
			valueType: 'variable',
		};

		setValue(newValue);
		onChange(newValue);

		if (!options?.keepPickerOpen) {
			setOpen('');
		}
	};

	const handleOnUnlinkVar = (): void => {
		if (
			missingPlainThemeJsonPreset &&
			compositePlainPresetPaint !== '' &&
			compositePlainPresetPaint !== undefined
		) {
			setValue({
				isValueAddon: false,
				valueType: null,
				name: null,
				settings: {},
			});
			onChange(
				unlinkPlainThemeJsonPresetCompositeToScalar(
					compositePlainPresetPaint,
					effectivePlainPresetSlug,
					presetResolutionCssVarInfix
				)
			);
			setOpen('');
			return;
		}

		if (hasPlainThemeJsonStringValueAddon || missingPlainThemeJsonPreset) {
			setValue({
				isValueAddon: false,
				valueType: null,
				name: null,
				settings: {},
			});
			onChange('');
			setOpen('');
			return;
		}

		if (!canUnlinkVariable(value)) {
			return;
		}

		setValue({
			isValueAddon: false,
			valueType: null,
			name: null,
			settings: {},
		});

		if (
			!isUndefined(value?.settings?.value) &&
			value?.settings?.value !== ''
		) {
			const processedValue = extractCssVarValue(value?.settings?.value);
			onChange(processedValue || value?.settings?.value);
		} else {
			const variable = getVariable(value.valueType, value.settings.id);

			if (!isUndefined(variable?.value) && variable?.value !== '') {
				const rawVarValue = variable?.value;
				if (typeof rawVarValue === 'string') {
					const processedValue = extractCssVarValue(rawVarValue);
					const next =
						processedValue !== undefined && processedValue !== ''
							? processedValue
							: rawVarValue;
					if (next !== undefined && next !== '') {
						onChange(next);
					}
				}
			}
		}

		setOpen('');
	};

	const handleOnClickDV = (data: DynamicValueItem): void => {
		const newValue = {
			settings: {
				...data,
			},
			name: data.name,
			isValueAddon: true,
			valueType: 'dynamic-value',
		};

		setValue(newValue);
		onChange(newValue);
		setOpen('dv-settings');
	};

	const handleOnClickRemove = (): void => {
		onChange('');
		setValue({
			isValueAddon: false,
			valueType: null,
			name: null,
			settings: {},
		});
		setOpen('');
	};

	const controlProps: ValueAddonControlProps = {
		value,
		rawValue: inputValue,
		setValue,
		onChange,
		types,
		variableTypes: normalizedVariableTypes,
		dynamicValueTypes:
			typeof dynamicValueTypes === 'string'
				? [dynamicValueTypes]
				: dynamicValueTypes,
		handleOnClickVar,
		handleOnUnlinkVar,
		handleOnClickDV,
		handleOnClickRemove,
		isOpen,
		setOpen,
		size,
		pointerProps,
		pickerProps: effectivePickerProps,
		isDeletedVar: false,
		isDeletedPlainThemeJsonPreset: missingPlainThemeJsonPreset,
		isDeletedDV: false,
		isActive:
			isValid(value) ||
			hasPlainThemeJsonStringValueAddon ||
			missingPlainThemeJsonPreset,
		themeJsonPlainPresetSlug:
			hasPlainThemeJsonStringValueAddon || missingPlainThemeJsonPreset
				? effectivePlainPresetSlug
				: '',
		themeJsonPlainPresetCompositePaint:
			compositePlainPresetPaint !== '' ? compositePlainPresetPaint : '',
		themeJsonResolutionBlockName,
		themeJsonResolutionPresetCssVarInfix:
			themeJsonResolutionPresetCssVarInfix !== undefined &&
			themeJsonResolutionPresetCssVarInfix !== null &&
			String(themeJsonResolutionPresetCssVarInfix) !== ''
				? String(themeJsonResolutionPresetCssVarInfix)
				: undefined,
		themeJsonPlainPresetVariableType:
			normalizedVariableTypes.length > 0
				? normalizedVariableTypes[0]
				: undefined,
	};

	/**
	 * Detect and add is deleted items to controlProps
	 * we use it inside ValueAddonControl
	 * also we use it outside of component for advanced implementation (ex: BoxSpacingControl)
	 */
	if (isValid(controlProps.value)) {
		if (controlProps.value.valueType === 'variable') {
			const item: ?VariableItem = getVariable(
				controlProps.value?.settings?.type,
				controlProps.value?.settings?.id
			);

			// Bindings are by slug (`settings.id`). Renamed display names refresh via
			// live catalog reads; changed slugs do not fall back to `settings.name`.
			controlProps.isDeletedVar = !item || isUndefined(item.value);
		} else if (controlProps.value.valueType === 'dynamic-value') {
			const item = getDynamicValue(
				controlProps.value.settings.group,
				controlProps.value.settings.name
			);

			if (isUndefined(item?.name)) {
				controlProps.isDeletedDV = true;
			}
		}
	}

	controlPropsRef.current = controlProps;

	return {
		valueAddonClassNames,
		isSetValueAddon: () =>
			isValid(value) ||
			isOpen !== '' ||
			hasPlainThemeJsonStringValueAddon ||
			missingPlainThemeJsonPreset,
		ValueAddonPointer: StableValueAddonPointer,
		ValueAddonControl: StableValueAddonControl,
		valueAddonControlProps: controlProps,
		handleOnClickVar,
		handleOnUnlinkVar,
		handleOnClickDV,
	};
};

export * from './utils';
export * from './helpers';
export {
	renderChangesetPreviewPart,
	CHANGESET_PREVIEW_VALUE_ADDON_CLASS,
} from './render-changeset-preview-part';
export {
	VAR_PICKER_PRESET_PANEL_FILTER,
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
	VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
	VarPickerPresetContext,
	useVarPickerPresetContext,
	VarPickerSummarySlotProvider,
	useVarPickerSummarySlot,
	VarPickerCustomAddProvider,
	useVarPickerCustomAddContext,
	VarPickerSectionCustomAddButton,
	resolveVariablePickerPresetGroupLabel,
	normalizeVariablePickerSearchQuery,
	tokenizeVariablePickerSearchQuery,
	buildVariablePickerSearchHaystack,
	variablePickerItemMatchesSearch,
	variablePickerHasAnySearchMatches,
	VarPickerSearchContext,
	useVarPickerSearchContext,
	VarPickerSearchEmptyState,
	useVarPickerSingleTypeCustomAddAction,
	PresetVariablesViewModeProvider,
	usePresetVariablesViewMode,
	loadPresetVariablesViewMode,
	savePresetVariablesViewMode,
	PRESET_VARIABLES_VIEW_MODE_STORAGE_KEY,
	PRESET_VARIABLES_VIEW_MODE_CHANGE_EVENT,
	PresetVariablesSummaryRow,
	PRESET_VARIABLES_SECTION_GAP,
	ValueAddonDisplay,
} from './components';
export {
	BlockBaseInjectedSlotFill,
	BlockBaseInjectedStyleTagFill,
} from './components/block-base-injected-slot-fill';
export {
	getBlockeraBlockInjectedSlotName,
	BLOCKERA_BLOCK_INJECTED_SLOT_NAME_FILTER,
} from './block-injected-slot-name';
export { applyRegisteredPresetPreviewPickerMerge } from './preset-preview-picker-props-registry';
