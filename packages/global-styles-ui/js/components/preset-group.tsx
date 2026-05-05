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
	Flex,
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
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

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
import { useCanEditGlobalStyles } from './use-global-styles-preset-edit';

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
	onChange: (newValue: Object) => void;
	repeaterItemHeader: React.ElementType;
	defaultPresetValue: VariableType | any;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	/**
	 * When true, new presets get `creatingStep` until the repeater row is closed once.
	 *
	 * @default true
	 */
	enableCreatingStep?: boolean;
	/**
	 * Optional component passed through to RepeaterControl; receives `item` and `itemId` per row.
	 */
	repeaterItemVariations?: React.ComponentType<{
		item: VariableType | Record<string, unknown>;
		itemId: string;
	}>;
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
	canEditGlobalStyles: boolean;
	repeaterItemVariations?: PresetGroupPropsType['repeaterItemVariations'];
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

	return <PresetFields {..._props} />;
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
	canEditGlobalStyles,
	repeaterItemVariations,
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
					type="modal"
					lockedFeature={{
						icon: <Icon icon="layers" iconSize={26} />,
						title: sprintf(
							/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
							__('Unlimited Custom %s Variables', 'blockera'),
							title
						),
						description: (
							<Flex direction="column" gap="6px">
								{__(
									'Add as many variables as your design system needs',
									'blockera'
								)}

								<Flex direction="row" gap="6px">
									<span className="blockera-free-plan-hint">
										{__('Free: 1 variable', 'blockera')}
									</span>
									<span className="blockera-pro-plan-hint">
										{__(
											'Pro: Unlimited variables',
											'blockera'
										)}
									</span>
								</Flex>
							</Flex>
						),
					}}
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

	const confirmDeleteModalProps = useMemo(() => {
		const deleteVariable = __('Delete variable', 'blockera');
		return {
			deleteButtonLabel: deleteVariable,
			warningText: getPresetDeleteConfirmWarningText(origin, title),
			errorNoticeText: __('This action cannot be undone.', 'blockera'),
			confirmCheckboxLabel: __(
				'I understand and want to delete this variable.',
				'blockera'
			),
		};
	}, [origin, title]);

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
			popoverClassName={controlInnerClassNames('popover-variables')}
			popoverTitle={popoverTitle}
			PromoComponent={renderPromo}
			canAddNewItem={canAddNewItem}
			addNewButtonLabel={sprintf(
				/* translators: %s: Preset group title (e.g. Font Sizes, Spacing) */
				__('Add New %s', 'blockera'),
				title
			)}
			addNewButtonDataTest={`global-styles-preset-add-${controlName}`}
			shouldConfirmDeleteModal={true}
			confirmDeleteModalProps={confirmDeleteModalProps}
			repeaterItemChildren={FieldsComponent}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemVariations={repeaterItemVariations}
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
			showPopoverTitleDelete={canEditGlobalStyles}
			actionButtonDelete={canEditGlobalStyles}
			actionButtonClone={canEditGlobalStyles}
			enablePromoCountOnRepeaterItemHeader={'custom' === origin}
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
	repeaterItemVariations,
}: PresetGroupPropsType) => {
	const pickerCtx = useVarPickerPresetContext();
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const isVariablePicker =
		pickerCtx.active === true && typeof pickerCtx.variableType === 'string';

	const cleanRepeaterForPersist = useCallback(
		(raw: Object) => {
			const cleaned = cleanupRepeater(raw as Record<string, unknown>);
			delete cleaned?.renderRepeaterItem;
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
						canAddNewItem={
							'custom' === origin && canEditGlobalStyles
						}
						canEditGlobalStyles={canEditGlobalStyles}
						repeaterItemHeader={repeaterItemHeader}
						defaultPresetValue={defaultPresetValue}
						presetFieldsPropsResolver={presetFieldsPropsResolver}
						enableCreatingStep={enableCreatingStep}
						selectable={isVariablePicker}
						valueCleanup={cleanRepeaterForPersist}
						onSelectableItemActivate={
							isVariablePicker
								? handleSelectableItemActivate
								: undefined
						}
						showItemEditButton={
							isVariablePicker &&
							!pickerCtx.disablePresetRowEdit &&
							canEditGlobalStyles
						}
						actionButtonAdd={
							pickerCtx.omitRepeaterSectionLabel ? false : true
						}
						shouldRenderRepeaterItem={repeaterSearchFilter}
						repeaterItemVariations={repeaterItemVariations}
					/>
				</BaseControl>
			</ControlContextProvider>
		</PresetStateContainer>
	);
};
