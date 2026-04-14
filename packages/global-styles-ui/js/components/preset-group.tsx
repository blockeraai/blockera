/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	RepeaterControl,
	UpgradePrompt,
	ControlContextProvider,
	getRepeaterActiveItemsCount,
	cleanupRepeater,
	normalizeVariablePickerSearchQuery,
	resolveVariablePickerPresetGroupLabel,
	useVarPickerPresetContext,
	variablePickerItemMatchesSearch,
} from '@blockera/controls';
import { noop, pascalCase, isObject } from '@blockera/utils';
import {
	classNames,
	controlClassNames,
	componentInnerClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { VariablesType, VariableType } from './types.ts';
import { PresetStateContainer } from './preset-state-container';
import { getPresetDeleteConfirmWarningText } from './preset-origin-utils';
import {
	applyVariablePickerRepeaterSelection,
	buildPresetVariablePickerPayload,
	stripIsSelectedFromRepeaterItems,
	stripRepeaterPickerUiFields,
} from './variable-picker-preset-utils';

export type PresetFieldsPropsResolver = (
	item: VariableType | any,
	itemId: string | number,
	origin: string | string[]
) => Record<string, any>;

export type PresetGroupPropsType = {
	label: string;
	title: string;
	controlName: string;
	variables: VariablesType;
	origin: string | string[];
	PresetFields: React.ElementType;
	repeaterItemHeader: React.ComponentType<{
		itemId: string;
		isOpen: boolean;
		item: VariableType | any;
		children?: React.ReactNode;
		setOpen: (isOpen: boolean) => boolean;
		isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
	}>;
	onChange: (newValue: Object) => void;
	defaultPresetValue: VariableType | any;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	/**
	 * When true, new presets get `creatingStep` until the repeater row is closed once.
	 *
	 * @default true
	 */
	enableCreatingStep?: boolean;
};

type PresetsProps = {
	label: string | React.ReactNode;
	title: string;
	controlName: string;
	onClose: () => void;
	canAddNewItem: boolean;
	defaultPresetValue: VariableType | any;
	variables: VariablesType;
	origin: string | string[];
	PresetFields: React.ElementType;
	repeaterItemHeader: PresetGroupPropsType['repeaterItemHeader'];
	onChange: (variables: VariablesType) => void;
	popoverTitle: string | ((itemId: string, item: VariableType) => string);
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	enableCreatingStep?: boolean;
	selectable?: boolean;
	valueCleanup?: (items: Object) => Object;
	onSelectableItemActivate?: (itemId: string, item: Object) => void;
	showItemEditButton?: boolean;
	actionButtonAdd?: boolean;
	shouldRenderRepeaterItem?: (
		itemId: string,
		item: Record<string, unknown>
	) => boolean;
};

const PresetFieldsComponent = ({
	item,
	itemId,
	origin,
	PresetFields,
	presetFieldsPropsResolver,
}: {
	item: VariableType;
	itemId: string | number;
	origin: string | string[];
	PresetFields: React.ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
}) => {
	const _props = useMemo(
		() => presetFieldsPropsResolver?.(item, itemId, origin) || {},
		[item, itemId, origin, presetFieldsPropsResolver]
	);

	return (
		<PresetStateContainer activeColor="#1ca120">
			<PresetFields {..._props} />
		</PresetStateContainer>
	);
};

const Presets = ({
	label,
	title,
	origin,
	onClose,
	onChange,
	variables,
	controlName,
	popoverTitle,
	PresetFields,
	canAddNewItem,
	defaultPresetValue,
	presetFieldsPropsResolver,
	enableCreatingStep = true,
	repeaterItemHeader: RepeaterItemHeader,
	selectable = false,
	valueCleanup: repeaterValueCleanup,
	onSelectableItemActivate,
	showItemEditButton = false,
	shouldRenderRepeaterItem,
	...props
}: PresetsProps) => {
	const renderPromo = useCallback(
		({
			items,
			isOpen = false,
			onClose: _onClose = noop,
		}: {
			isOpen: boolean;
			items: VariablesType;
			onClose: (isClose: boolean) => void;
		}): React.ReactNode | null => {
			if (getRepeaterActiveItemsCount(items) < 1) {
				return null;
			}

			return (
				<UpgradePrompt
					heading={sprintf(
						/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
						__('Multiple %s', 'blockera'),
						title
					)}
					featuresList={[
						sprintf(
							/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
							__('Multiple %s', 'blockera'),
							title
						),
						sprintf(
							/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
							__('Advanced %s Settings', 'blockera'),
							title
						),
						sprintf(
							/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
							__('Rename ID of %s Variable', 'blockera'),
							title
						),
						__('Premium Features', 'blockera'),
					]}
					isOpen={isOpen}
					onClose={_onClose ? _onClose : noop}
				/>
			);
		},
		[title]
	);

	const FieldsComponent = useCallback(
		({ item, itemId }: { item: VariableType; itemId: string | number }) => (
			<PresetFieldsComponent
				item={item}
				itemId={itemId}
				origin={origin}
				PresetFields={PresetFields}
				presetFieldsPropsResolver={presetFieldsPropsResolver}
			/>
		),
		[origin, PresetFields, presetFieldsPropsResolver]
	);

	const deleteConfirmWarningText = useMemo(
		() => getPresetDeleteConfirmWarningText(origin, title),
		[origin, title]
	);

	return (
		<RepeaterControl
			label={label}
			id={controlName}
			onChange={onChange}
			showNoItemsMessage={true}
			noItemsMessage={sprintf(
				/* translators: %s: Preset group origin (e.g. theme, default, custom) */
				__('No %s variable.', 'blockera'),
				pascalCase(origin)
			)}
			popoverClassName={componentInnerClassNames('popover-variables')}
			popoverTitle={popoverTitle}
			PromoComponent={renderPromo}
			canAddNewItem={canAddNewItem}
			addNewButtonLabel={sprintf(
				/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
				__('Add New %s', 'blockera'),
				title
			)}
			shouldConfirmDeleteModal={true}
			deleteConfirmWarningText={deleteConfirmWarningText}
			repeaterItemChildren={FieldsComponent}
			repeaterItemHeader={RepeaterItemHeader}
			defaultRepeaterItemValue={defaultPresetValue}
			enableCreatingStep={enableCreatingStep}
			className={classNames(
				controlClassNames('preset-group', controlName),
				{
					'blockera-global-styles-preset-repeater': selectable,
				}
			)}
			selectable={selectable}
			valueCleanup={repeaterValueCleanup}
			onSelectableItemActivate={onSelectableItemActivate}
			showItemEditButton={showItemEditButton}
			shouldRenderRepeaterItem={shouldRenderRepeaterItem}
			showPopoverTitleDelete={true}
			{...props}
		/>
	);
};

export const PresetGroup = ({
	label,
	title,
	origin,
	onChange,
	variables,
	controlName,
	PresetFields,
	repeaterItemHeader,
	defaultPresetValue,
	presetFieldsPropsResolver,
	enableCreatingStep = true,
}: PresetGroupPropsType) => {
	const pickerCtx = useVarPickerPresetContext();
	const isVariablePicker =
		pickerCtx.active === true && typeof pickerCtx.variableType === 'string';

	const cleanRepeaterForPersist = useCallback(
		(raw: Object) => {
			const cleaned = cleanupRepeater(raw as Record<string, unknown>);
			if (!isVariablePicker) {
				return cleaned;
			}
			return stripIsSelectedFromRepeaterItems(
				cleaned as Record<string, unknown>
			);
		},
		[isVariablePicker]
	);

	const handleRepeaterOnChange = useCallback(
		(newValue: Object) => {
			if (
				isObject(newValue) &&
				Object.prototype.hasOwnProperty.call(
					newValue,
					'modifyControlValue'
				) &&
				(newValue as { value?: Object }).value !== undefined &&
				(newValue as { value?: Object }).value !== null
			) {
				onChange(
					cleanRepeaterForPersist(
						(newValue as { value: Object }).value
					)
				);
				return;
			}
			onChange(newValue);
		},
		[onChange, cleanRepeaterForPersist]
	);

	const handleSelectableItemActivate = useCallback(
		(_itemId: string, item: Object) => {
			if (
				!isVariablePicker ||
				!pickerCtx.controlProps?.handleOnClickVar ||
				!pickerCtx.variableType
			) {
				return;
			}
			const payload = buildPresetVariablePickerPayload(
				item as Record<string, unknown>,
				origin,
				pickerCtx.variableType
			);
			pickerCtx.controlProps.handleOnClickVar(payload as never);
		},
		[isVariablePicker, pickerCtx, origin]
	);

	const pickerValue = pickerCtx.controlProps?.value;

	const variablesForRepeater = useMemo(() => {
		if (!isVariablePicker || typeof pickerCtx.variableType !== 'string') {
			return stripRepeaterPickerUiFields(variables) as typeof variables;
		}
		return applyVariablePickerRepeaterSelection(variables, {
			variableType: pickerCtx.variableType,
			origin,
			pickerValue,
		}) as typeof variables;
	}, [
		isVariablePicker,
		variables,
		pickerCtx.variableType,
		origin,
		pickerValue,
	]);

	const repeaterSearchFilter = useMemo(() => {
		if (!isVariablePicker) {
			return undefined;
		}
		const q = normalizeVariablePickerSearchQuery(pickerCtx.searchQuery);
		if (!q) {
			return undefined;
		}
		return (itemId: string, item: Record<string, unknown>) =>
			variablePickerItemMatchesSearch(item, q);
	}, [isVariablePicker, pickerCtx.searchQuery]);

	const repeaterContextValue = useMemo(
		() => ({
			name: `${origin}-${title.replace(/\s/g, '-').toLowerCase()}-${isVariablePicker ? 'variable-picker' : 'global-styles'}`,
			value: variablesForRepeater,
			// Variable picker: push `isSelected` / `selectable` into repeater store when the bound value changes.
			needUpdate: () => isVariablePicker,
		}),
		[origin, title, variablesForRepeater, isVariablePicker]
	);

	const labelForVariablePicker = useMemo(() => {
		if (pickerCtx.omitRepeaterSectionLabel) {
			return '';
		}
		if (!isVariablePicker) {
			return label;
		}
		return resolveVariablePickerPresetGroupLabel(title, origin, label);
	}, [
		isVariablePicker,
		label,
		origin,
		pickerCtx.omitRepeaterSectionLabel,
		title,
	]);

	const repeaterLabel = useMemo(() => {
		if (pickerCtx.omitRepeaterSectionLabel) {
			return '';
		}
		if (isVariablePicker) {
			return (
				<span
					className={controlInnerClassNames('picker-category-header')}
				>
					{labelForVariablePicker}
				</span>
			);
		}
		return label;
	}, [
		isVariablePicker,
		label,
		labelForVariablePicker,
		pickerCtx.omitRepeaterSectionLabel,
	]);

	return (
		<PresetStateContainer activeColor="#1ca120">
			<ControlContextProvider
				value={repeaterContextValue}
				storeName={'blockera/controls/repeater'}
			>
				<BaseControl controlName={controlName} columns="columns-1">
					<Presets
						title={title}
						label={repeaterLabel}
						onClose={noop}
						origin={origin}
						onChange={handleRepeaterOnChange}
						variables={variablesForRepeater}
						controlName={controlName}
						PresetFields={PresetFields}
						popoverTitle={__('Edit Variable', 'blockera')}
						canAddNewItem={'custom' === origin}
						repeaterItemHeader={repeaterItemHeader}
						defaultPresetValue={defaultPresetValue}
						presetFieldsPropsResolver={presetFieldsPropsResolver}
						enableCreatingStep={enableCreatingStep}
						selectable={isVariablePicker}
						valueCleanup={
							isVariablePicker
								? cleanRepeaterForPersist
								: undefined
						}
						onSelectableItemActivate={
							isVariablePicker
								? handleSelectableItemActivate
								: undefined
						}
						showItemEditButton={
							isVariablePicker && !pickerCtx.disablePresetRowEdit
						}
						actionButtonAdd={
							pickerCtx.omitRepeaterSectionLabel ? false : true
						}
						shouldRenderRepeaterItem={repeaterSearchFilter}
					/>
				</BaseControl>
			</ControlContextProvider>
		</PresetStateContainer>
	);
};
