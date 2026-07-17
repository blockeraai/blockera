/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ComponentType, ElementType, ReactNode } from 'react';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { noop } from '@blockera/utils';
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import {
	RepeaterContextProvider,
	useControlContext,
	useVarPickerPresetContext,
	variablePickerPopoverTypeClassName,
	variablePopoverModeClassName,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { VariableType } from '../types';
import {
	applyVariablePickerRepeaterSelection,
	buildPresetVariablePickerPayload,
	shouldKeepVariablePickerOpenForRowActivation,
	stripRepeaterPickerUiFields,
} from '../variable-picker-preset-utils';
import { useCanEditGlobalStyles } from '../use-global-styles-preset-edit';

/**
 * Resolves the variable type for taxonomy preset popover CSS modifiers.
 * Prefers the active variable picker type; otherwise derives from control id
 * (e.g. `color-presets-theme-taxonomy-tree` → `color`).
 */
function resolveTaxonomyPopoverVariableType(
	controlId: string,
	pickerVariableType: string | null | undefined
): string | null {
	if (
		typeof pickerVariableType === 'string' &&
		pickerVariableType.trim() !== ''
	) {
		return pickerVariableType.trim().toLowerCase();
	}

	const controlName = controlId.replace(/-taxonomy-tree$/, '');
	const withoutOrigin = controlName.replace(/-presets?-[a-z]+$/, '');
	if (withoutOrigin === controlName) {
		return null;
	}

	const type = withoutOrigin.replace(/-preset$/, '');
	return type !== '' ? type : null;
}

export type TaxonomyRepeaterBridgeInnerProps = {
	controlId: string;
	origin: string;
	repeaterItemHeader: ElementType;
	defaultRepeaterItemValue: Record<string, unknown>;
	valueCleanup: (raw: unknown) => Record<string, unknown>;
	handleRepeaterRootChange: (payload: unknown) => void;
	repeaterItemVariations?: ComponentType<{
		item: VariableType | Record<string, unknown>;
		itemId: string;
	}> | null;
	repeaterItemChildren?: ComponentType<{
		item: VariableType | Record<string, unknown>;
		itemId: string | number;
	}>;
	children: ReactNode;
};

export function TaxonomyRepeaterBridgeInner({
	controlId,
	origin,
	repeaterItemHeader: RepeaterItemHeader,
	defaultRepeaterItemValue,
	valueCleanup,
	handleRepeaterRootChange,
	repeaterItemVariations,
	repeaterItemChildren,
	children,
}: TaxonomyRepeaterBridgeInnerProps) {
	const repeaterHook = useControlContext({
		defaultValue: {},
		sideEffect: true,
		repeater: {
			defaultRepeaterItemValue,
			repeaterId: undefined,
		},
		onChange: handleRepeaterRootChange,
		valueCleanup,
		mergeInitialAndDefault: true,
	});

	const pickerCtx = useVarPickerPresetContext();

	const canEditGlobalStyles = useCanEditGlobalStyles();

	const isVariablePicker =
		pickerCtx.active === true && typeof pickerCtx.variableType === 'string';

	const showPickerItemEditButton =
		isVariablePicker &&
		!pickerCtx.disablePresetRowEdit &&
		canEditGlobalStyles;

	const pickerValue = pickerCtx.controlProps?.value;

	const repeaterItemsForContext = useMemo(() => {
		const raw = repeaterHook.value;
		if (!isVariablePicker || typeof pickerCtx.variableType !== 'string') {
			return stripRepeaterPickerUiFields(raw) ?? raw ?? {};
		}
		return (
			applyVariablePickerRepeaterSelection(raw, {
				variableType: pickerCtx.variableType,
				origin,
				pickerValue,
			}) ??
			raw ??
			{}
		);
	}, [
		repeaterHook.value,
		isVariablePicker,
		pickerCtx.variableType,
		origin,
		pickerValue,
	]);

	const handleSelectableItemActivate = useCallback(
		(_itemId: string | number, row: Record<string, unknown>) => {
			if (
				!isVariablePicker ||
				!pickerCtx.controlProps?.handleOnClickVar ||
				typeof pickerCtx.variableType !== 'string'
			) {
				return;
			}
			const payload = buildPresetVariablePickerPayload(
				row,
				origin,
				pickerCtx.variableType
			);
			pickerCtx.controlProps.handleOnClickVar(payload as never, {
				keepPickerOpen: shouldKeepVariablePickerOpenForRowActivation(
					row,
					{
						variableType: pickerCtx.variableType,
						origin,
						pickerValue: pickerCtx.controlProps?.value,
					}
				),
			});
		},
		[
			isVariablePicker,
			pickerCtx.controlProps,
			pickerCtx.variableType,
			origin,
		]
	);

	const { getControlPath } = useControlContext();

	const resolvedControlId = repeaterHook.controlInfo?.name ?? controlId;

	const popoverClassName = useMemo(() => {
		const variableType = resolveTaxonomyPopoverVariableType(
			resolvedControlId,
			pickerCtx.variableType
		);
		return classNames(
			controlInnerClassNames('popover-variables'),
			variablePopoverModeClassName('edit'),
			variableType ? variablePickerPopoverTypeClassName(variableType) : ''
		);
	}, [resolvedControlId, pickerCtx.variableType]);

	const repeaterContextValue = useMemo(
		() => ({
			design: 'minimal',
			mode: 'popover',
			count: 0,
			setCount: noop,
			disableAddNewItem: false,
			setDisableAddNewItem: noop,
			popoverTitle: __('Edit Variable', 'blockera'),
			actionButtonsType: 'inline',
			actionMenuButtonLabel: __('More Options', 'blockera'),
			popoverClassName,
			maxItems: -1,
			minItems: 0,
			selectable: isVariablePicker,
			onSelectableItemActivate: isVariablePicker
				? handleSelectableItemActivate
				: undefined,
			shouldRenderRepeaterItem: undefined,
			showItemEditButton: showPickerItemEditButton,
			actionButtonAdd: false,
			actionButtonVisibility: false,
			actionButtonDelete: false,
			actionButtonClone: false,
			actionButtonReset: false,
			disableRegenerateId: true,
			shouldConfirmDeleteModal: false,
			confirmDeleteModalProps: undefined,
			onChange: handleRepeaterRootChange,
			onDelete: noop,
			onReset: noop,
			controlId: repeaterHook.controlInfo?.name ?? controlId,
			repeaterId: undefined,
			overrideItem: undefined,
			valueCleanup,
			getControlPath,
			PromoComponent: undefined,
			itemIdGenerator: undefined,
			repeaterItemOpener: undefined,
			repeaterItemHeader: (_props: Record<string, unknown>) => {
				const row = _props?.item as
					(VariableType & { baseSlug?: string }) | undefined;
				let headerContextType: string;
				if (row?.baseSlug) {
					headerContextType = 'repeater';
				} else if (typeof _props?.contextType === 'string') {
					headerContextType = _props.contextType as string;
				} else {
					headerContextType = 'taxonomy';
				}
				return (
					<RepeaterItemHeader
						{..._props}
						contextType={headerContextType}
					/>
				);
			},
			repeaterItemChildren,
			repeaterItemVariations,
			defaultRepeaterItemValue,
			enableCreatingStep: false,
			repeaterItems: repeaterItemsForContext,
			customProps: {},
			enablePromoCountOnRepeaterItemHeader: false,
			popoverProps: undefined,
			popoverTitleButtonsRight: undefined,
			labelPopoverTitle: undefined,
			labelDescription: undefined,
		}),
		[
			RepeaterItemHeader,
			controlId,
			defaultRepeaterItemValue,
			getControlPath,
			handleRepeaterRootChange,
			handleSelectableItemActivate,
			isVariablePicker,
			popoverClassName,
			repeaterHook.controlInfo?.name,
			repeaterItemsForContext,
			repeaterItemChildren,
			repeaterItemVariations,
			showPickerItemEditButton,
			valueCleanup,
		]
	);

	return (
		<RepeaterContextProvider {...repeaterContextValue}>
			{children}
		</RepeaterContextProvider>
	);
}
