/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';

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
	usePresetVariablesViewMode,
	useVarPickerCustomAddRegister,
	useVarPickerPresetContext,
	useVarPickerSearchContext,
	useVariablePickerSearchQuery,
	VarPickerSectionCustomAddButton,
	variablePickerItemMatchesSearch,
} from '@blockera/controls';
import { noop, pascalCase, isObject, isEquals } from '@blockera/utils';
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
import { resolvePresetRepeaterItemSize } from './preset-taxonomy-ui/preset-taxonomy-utils';
import {
	applyVariablePickerRepeaterSelection,
	buildPresetVariablePickerPayload,
	mergeVariablePickerCreatingStepIntoItems,
	resolveVariablePickerCustomAddPresetValue,
	shouldClearVariablePickerFeatureOnRowDelete,
	stripIsSelectedFromRepeaterItems,
	stripRepeaterPickerUiFields,
	syncVariablePickerCreatingStepSlugs,
} from './variable-picker-preset-utils';
import {
	useCanAddCustomPresetInVariablePicker,
	useCanEditGlobalStyles,
} from './use-global-styles-preset-edit';

function areCreatingStepSlugMapsEqual(
	a: Record<string, true>,
	b: Record<string, true>
): boolean {
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	return keysA.every((key) => b[key]);
}

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
	/**
	 * When true, the flat preset repeater is omitted (all rows handled by taxonomy UI).
	 */
	suppressThemeRepeaterWhenTaxonomyBasePopulated?: boolean;
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
	onDelete?: (itemId: string, items: Object) => Object;
	onSelectableItemActivate?: (itemId: string, item: Object) => void;
	showItemEditButton?: boolean;
	actionButtonAdd?: boolean;
	shouldRenderRepeaterItem?: (
		itemId: string,
		item: Record<string, unknown>
	) => boolean;
	resolveRepeaterItemSize?: (
		itemId: string,
		item: Record<string, unknown>
	) => 'full' | 'small';
	canEditGlobalStyles: boolean;
	repeaterItemVariations?: PresetGroupPropsType['repeaterItemVariations'];
	withoutAdvancedLabel?: boolean;
	onRegisterAddNewAction?: (
		action: {
			onClick: () => void;
			label: string;
			dataTest?: string;
			canAdd: boolean;
			disabled?: boolean;
		} | null
	) => (() => void) | void;
	getDynamicDefaultRepeaterItem?: (
		index: number,
		defaultRepeaterItemValue: Record<string, unknown>
	) => Record<string, unknown>;
	injectHeaderButtonsEnd?: React.ReactNode;
	suppressNativeSectionAddButton?: boolean;
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
	onDelete,
	onSelectableItemActivate,
	showItemEditButton = false,
	shouldRenderRepeaterItem,
	resolveRepeaterItemSize,
	canEditGlobalStyles,
	repeaterItemVariations,
	withoutAdvancedLabel = false,
	onRegisterAddNewAction,
	getDynamicDefaultRepeaterItem,
	injectHeaderButtonsEnd,
	suppressNativeSectionAddButton = false,
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
			onDelete={onDelete}
			onSelectableItemActivate={onSelectableItemActivate}
			showItemEditButton={showItemEditButton}
			shouldRenderRepeaterItem={shouldRenderRepeaterItem}
			resolveRepeaterItemSize={resolveRepeaterItemSize}
			showPopoverTitleDelete={canEditGlobalStyles}
			actionButtonDelete={canEditGlobalStyles}
			actionButtonClone={canEditGlobalStyles}
			enablePromoCountOnRepeaterItemHeader={'custom' === origin}
			withoutAdvancedLabel={withoutAdvancedLabel}
			onRegisterAddNewAction={onRegisterAddNewAction}
			getDynamicDefaultRepeaterItem={getDynamicDefaultRepeaterItem}
			injectHeaderButtonsEnd={injectHeaderButtonsEnd}
			suppressNativeSectionAddButton={suppressNativeSectionAddButton}
			{...props}
		/>
	);
};

export const PresetGroup = memo(function PresetGroup({
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
	suppressThemeRepeaterWhenTaxonomyBasePopulated = false,
}: PresetGroupPropsType) {
	const pickerCtx = useVarPickerPresetContext();
	const pickerSearchCtx = useVarPickerSearchContext();
	const variablePickerSearchQuery = useVariablePickerSearchQuery();
	const customAddRegister = useVarPickerCustomAddRegister();
	const { viewMode } = usePresetVariablesViewMode();
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const canAddCustomPresetInPicker = useCanAddCustomPresetInVariablePicker();
	const isVariablePicker =
		pickerCtx.active === true && typeof pickerCtx.variableType === 'string';
	// Outer picker category titles replace theme/default labels only; custom keeps its header + add button.
	const omitOriginRepeaterSectionLabel =
		pickerCtx.omitRepeaterSectionLabel === true && origin !== 'custom';
	const pickerControlProps =
		pickerCtx.controlPropsRef?.current ?? pickerCtx.controlProps;
	const pickerControlPropsRef = useRef(pickerControlProps);
	pickerControlPropsRef.current = pickerControlProps;

	const [creatingStepRevision, setCreatingStepRevision] = useState(0);
	const creatingStepSlugsRef = useRef<Record<string, true>>({});

	useEffect(() => {
		if (!isVariablePicker) {
			creatingStepSlugsRef.current = {};
		}
	}, [isVariablePicker]);

	const cleanRepeaterForPersist = useCallback(
		(raw: Object) => {
			const cleaned = cleanupRepeater(raw as Record<string, unknown>);
			delete cleaned?.renderRepeaterItem;

			if (enableCreatingStep) {
				for (const key of Object.keys(cleaned)) {
					const row = cleaned[key];
					if (row && typeof row === 'object' && !Array.isArray(row)) {
						delete (row as Record<string, unknown>).creatingStep;
					}
				}
			}

			if (!isVariablePicker) {
				return cleaned;
			}
			return stripIsSelectedFromRepeaterItems(
				cleaned as Record<string, unknown>
			);
		},
		[enableCreatingStep, isVariablePicker]
	);

	const handleRepeaterOnChange = useCallback(
		(newValue: Object) => {
			const raw =
				isObject(newValue) &&
				Object.prototype.hasOwnProperty.call(
					newValue,
					'modifyControlValue'
				) &&
				(newValue as { value?: Object }).value !== undefined &&
				(newValue as { value?: Object }).value !== null
					? (newValue as { value: Object }).value
					: newValue;

			if (enableCreatingStep) {
				const prevCreatingStepSlugs = creatingStepSlugsRef.current;
				const nextCreatingStepSlugs =
					syncVariablePickerCreatingStepSlugs(
						prevCreatingStepSlugs,
						raw
					);

				creatingStepSlugsRef.current = nextCreatingStepSlugs;

				if (
					!areCreatingStepSlugMapsEqual(
						prevCreatingStepSlugs,
						nextCreatingStepSlugs
					)
				) {
					setCreatingStepRevision((revision) => revision + 1);
				}
			}

			onChange(cleanRepeaterForPersist(raw));
		},
		[onChange, cleanRepeaterForPersist, enableCreatingStep]
	);

	const handleSelectableItemActivate = useCallback(
		(_itemId: string, item: Object) => {
			const controlProps = pickerControlPropsRef.current;

			if (
				!isVariablePicker ||
				!controlProps?.handleOnClickVar ||
				!pickerCtx.variableType
			) {
				return;
			}
			const row = item as Record<string, unknown>;
			const payload = buildPresetVariablePickerPayload(
				row,
				origin,
				pickerCtx.variableType
			);
			controlProps.handleOnClickVar(payload as never, {
				keepPickerOpen: row.creatingStep === true,
			});
		},
		[isVariablePicker, pickerCtx.variableType, origin]
	);

	const handleRepeaterItemDelete = useCallback(
		(itemId: string, items: Object) => {
			const controlProps = pickerControlPropsRef.current;
			const record = items as Record<string, unknown>;
			const item = record[itemId];

			if (
				isVariablePicker &&
				typeof pickerCtx.variableType === 'string' &&
				controlProps &&
				item &&
				typeof item === 'object' &&
				!Array.isArray(item) &&
				shouldClearVariablePickerFeatureOnRowDelete(
					item as Record<string, unknown>,
					{
						variableType: pickerCtx.variableType,
						origin,
						pickerValue: controlProps.value,
						themeJsonPlainPresetSlug:
							controlProps.themeJsonPlainPresetSlug,
					}
				)
			) {
				controlProps.handleOnClickRemove();
			}

			const next = { ...record };
			delete next[itemId];
			return next;
		},
		[isVariablePicker, pickerCtx.variableType, origin]
	);

	const pickerValue = pickerControlProps?.value;

	const variablesForRepeater = useMemo(() => {
		const base = stripRepeaterPickerUiFields(variables) as typeof variables;

		const withCreatingStep = enableCreatingStep
			? mergeVariablePickerCreatingStepIntoItems(
					base,
					creatingStepSlugsRef.current
				)
			: base;

		if (!isVariablePicker || typeof pickerCtx.variableType !== 'string') {
			return withCreatingStep;
		}

		return applyVariablePickerRepeaterSelection(withCreatingStep, {
			variableType: pickerCtx.variableType,
			origin,
			pickerValue,
		}) as typeof variables;
	}, [
		isVariablePicker,
		variables,
		creatingStepRevision,
		enableCreatingStep,
		pickerCtx.variableType,
		origin,
		pickerValue,
	]);

	const repeaterSearchFilter = useMemo(() => {
		if (!isVariablePicker) {
			return undefined;
		}
		const q = normalizeVariablePickerSearchQuery(variablePickerSearchQuery);
		if (!q) {
			return undefined;
		}
		return (itemId: string, item: Record<string, unknown>) =>
			variablePickerItemMatchesSearch(item, q);
	}, [isVariablePicker, variablePickerSearchQuery]);

	const resolveRepeaterItemInterfaceSize = useCallback(
		(_itemId: string, item: Record<string, unknown>) => {
			if (
				viewMode === 'list' ||
				(isVariablePicker &&
					normalizeVariablePickerSearchQuery(
						variablePickerSearchQuery
					) !== '')
			) {
				return 'full';
			}
			return resolvePresetRepeaterItemSize(item);
		},
		[isVariablePicker, variablePickerSearchQuery, viewMode]
	);

	const isPickerSearchActive = useMemo(
		() =>
			isVariablePicker &&
			normalizeVariablePickerSearchQuery(variablePickerSearchQuery) !==
				'',
		[isVariablePicker, variablePickerSearchQuery]
	);

	const registerCustomAddNewAction = useCallback(
		(
			action: {
				onClick: () => void;
				label: string;
				dataTest?: string;
				canAdd: boolean;
				disabled?: boolean;
			} | null
		) => {
			if (
				origin !== 'custom' ||
				!isVariablePicker ||
				!customAddRegister ||
				typeof pickerCtx.variableType !== 'string'
			) {
				return undefined;
			}

			return customAddRegister(pickerCtx.variableType, action);
		},
		[origin, isVariablePicker, customAddRegister, pickerCtx.variableType]
	);

	const getDynamicDefaultRepeaterItem = useCallback(
		(
			_count: number,
			staticDefault: Record<string, unknown>
		): Record<string, unknown> => {
			const controlProps = pickerControlPropsRef.current;

			if (
				!isVariablePicker ||
				origin !== 'custom' ||
				typeof pickerCtx.variableType !== 'string'
			) {
				return staticDefault;
			}

			return resolveVariablePickerCustomAddPresetValue({
				rawValue: controlProps?.rawValue,
				variableType: pickerCtx.variableType,
				defaultPresetValue: staticDefault,
				blockName: controlProps?.themeJsonResolutionBlockName,
				searchSeed:
					pickerSearchCtx.consumeAddSearchSeed?.() ?? undefined,
			});
		},
		[
			isVariablePicker,
			origin,
			pickerCtx.variableType,
			pickerSearchCtx.consumeAddSearchSeed,
		]
	);

	const hasPickerSearchMatches = useMemo(() => {
		if (!isPickerSearchActive || !repeaterSearchFilter) {
			return true;
		}
		for (const [itemId, item] of Object.entries(
			variablesForRepeater ?? {}
		)) {
			if (!item || typeof item !== 'object') {
				continue;
			}
			const row = item as Record<string, unknown>;
			if (row.renderRepeaterItem === false || row.isVisible === false) {
				continue;
			}
			if (repeaterSearchFilter(itemId, row)) {
				return true;
			}
		}
		return false;
	}, [isPickerSearchActive, repeaterSearchFilter, variablesForRepeater]);

	const stableRepeaterContextRef = useRef<{
		name: string;
		value: VariablesType;
	} | null>(null);

	const repeaterContextValue = useMemo(() => {
		const name = `${origin}-${title.replace(/\s/g, '-').toLowerCase()}-${isVariablePicker ? 'variable-picker' : 'global-styles'}`;
		const prev = stableRepeaterContextRef.current;

		if (
			prev &&
			prev.name === name &&
			isEquals(prev.value, variablesForRepeater)
		) {
			return prev;
		}

		const next = {
			name,
			value: variablesForRepeater,
		};
		stableRepeaterContextRef.current = next;
		return next;
	}, [origin, title, variablesForRepeater, isVariablePicker]);

	const labelForVariablePicker = useMemo(() => {
		if (omitOriginRepeaterSectionLabel) {
			return '';
		}
		if (!isVariablePicker) {
			return label;
		}
		const isMultiTypeVariablePicker =
			(pickerControlProps?.variableTypes || []).length > 1;
		return resolveVariablePickerPresetGroupLabel(
			title,
			origin,
			label,
			isMultiTypeVariablePicker
		);
	}, [
		isVariablePicker,
		label,
		origin,
		omitOriginRepeaterSectionLabel,
		pickerControlProps?.variableTypes,
		title,
	]);

	const repeaterLabel = useMemo(() => {
		if (omitOriginRepeaterSectionLabel) {
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
		omitOriginRepeaterSectionLabel,
	]);

	const customSectionAddButton = useMemo(() => {
		if (
			!isVariablePicker ||
			origin !== 'custom' ||
			typeof pickerCtx.variableType !== 'string'
		) {
			return undefined;
		}

		return (
			<VarPickerSectionCustomAddButton
				variableType={pickerCtx.variableType}
			/>
		);
	}, [isVariablePicker, origin, pickerCtx.variableType]);

	if (suppressThemeRepeaterWhenTaxonomyBasePopulated) {
		return null;
	}

	const useVariablePickerCustomSectionAddButton =
		customSectionAddButton !== undefined;

	const keepMountedForCustomAddRegistration =
		isPickerSearchActive &&
		!hasPickerSearchMatches &&
		pickerSearchCtx.deferSectionSearchEmptyState &&
		useVariablePickerCustomSectionAddButton;

	const hidePresetGroupForSearch =
		isPickerSearchActive &&
		!hasPickerSearchMatches &&
		pickerSearchCtx.deferSectionSearchEmptyState &&
		!useVariablePickerCustomSectionAddButton;

	if (hidePresetGroupForSearch) {
		return null;
	}

	if (
		isPickerSearchActive &&
		!hasPickerSearchMatches &&
		!pickerSearchCtx.deferSectionSearchEmptyState
	) {
		return (
			<div
				className={controlInnerClassNames('repeater-filter-empty')}
				style={{ opacity: 0.5, fontSize: '12px' }}
			>
				{__('No variables match your search.', 'blockera')}
			</div>
		);
	}

	const presetGroupContent = (
		<PresetStateContainer activeColor="var(--blockera-controls-block-variations-style)">
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
							'custom' === origin &&
							(isVariablePicker
								? canAddCustomPresetInPicker
								: canEditGlobalStyles)
						}
						canEditGlobalStyles={canEditGlobalStyles}
						repeaterItemHeader={repeaterItemHeader}
						defaultPresetValue={defaultPresetValue}
						presetFieldsPropsResolver={presetFieldsPropsResolver}
						enableCreatingStep={enableCreatingStep}
						selectable={isVariablePicker}
						onDelete={
							isVariablePicker
								? handleRepeaterItemDelete
								: undefined
						}
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
							(isVariablePicker && origin === 'custom') ||
							!omitOriginRepeaterSectionLabel
						}
						shouldRenderRepeaterItem={repeaterSearchFilter}
						resolveRepeaterItemSize={
							resolveRepeaterItemInterfaceSize
						}
						repeaterItemVariations={repeaterItemVariations}
						withoutAdvancedLabel={isVariablePicker}
						onRegisterAddNewAction={
							useVariablePickerCustomSectionAddButton
								? registerCustomAddNewAction
								: undefined
						}
						getDynamicDefaultRepeaterItem={
							getDynamicDefaultRepeaterItem
						}
						injectHeaderButtonsEnd={customSectionAddButton}
						suppressNativeSectionAddButton={
							useVariablePickerCustomSectionAddButton
						}
					/>
				</BaseControl>
			</ControlContextProvider>
		</PresetStateContainer>
	);

	if (keepMountedForCustomAddRegistration) {
		return (
			<div hidden aria-hidden="true">
				{presetGroupContent}
			</div>
		);
	}

	return presetGroupContent;
});
