// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import {
	Fragment,
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import { STORE_NAME } from '@blockera/data';

/**
 * Internal dependencies
 */
import { canUnlinkVariable, getVariableIcon } from '../../helpers';
import { hasThemeJsonPlainPresetSlug, isValid } from '../../utils';
import { ControlContextProvider } from '../../../context';
import { Button, Flex, Popover, SearchControl } from '../../../libs';
import { PresetVariablesSummaryRow } from './preset-variables-summary-row';
import { PresetVariablesViewModeProvider } from './preset-variables-view-mode';
import { PRESET_VARIABLES_SECTION_GAP } from './preset-variables-section-gap';
import { VarPickerSummarySlotProvider } from './var-picker-summary-slot';
import {
	getPopoverRoot,
	hasNestedOverlayOpenAsideFrom,
	isElementInsideVariablePickerSelectionTarget,
	isElementInsideVariablePickerPopover,
	isOtherPopoverClosing,
	isPopoverDismissIgnoredTarget,
	markPopoverClosing,
	registerPopoverOpen,
} from '../../../libs/popover/utils';
import { PickerCategory, PickerValueItem } from '../index';
import type { ValueAddonControlProps } from '../control/types';
import { VarPickerPresetContext } from './var-picker-preset-context';
import {
	VarPickerCustomAddProvider,
	type VarPickerCustomAddAction,
} from './var-picker-custom-add-context';
import { VarPickerCustomAddButton } from './var-picker-section-custom-add-button';
import { VarPickerSearchContext } from './var-picker-search-context';
import { VarPickerSearchEmptyState } from './var-picker-search-empty-state';
import { useVarPickerSingleTypeCustomAddAction } from './use-var-picker-single-type-custom-add-action';
import { useVarPickerAddWithSearchClear } from './use-var-picker-add-with-search-clear';
import { VarPickerAddActionRefBridge } from './var-picker-add-action-ref-bridge';
import {
	buildVariablePickerSectionKeys,
	collectCatalogItemsForVariableType,
	getSupplementalCustomVariableSections,
	isVariablePickerDynamicGroupSection,
	normalizeVariablePickerSearchQuery,
	resolveVariablePickerRow,
	variablePickerHasAnySearchMatches,
	variablePickerItemMatchesSearch,
	variablePickerPopoverTypeClassName,
	variablePopoverModeClassName,
} from './var-picker-helpers';
import {
	VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
} from './var-picker-constants';

export {
	VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
	VAR_PICKER_PRESET_PANEL_FILTER,
	MISSING_VARIABLE_CAN_RECREATE_FILTER,
	MISSING_VARIABLE_RECREATE_FILTER,
} from './var-picker-constants';

/**
 * Global-styles preset panels usually render their own section labels. Width-size is
 * an exception: its catalog rows omit repeater section labels, so the picker keeps
 * the outer category title (e.g. “Width & Height Variables”).
 */
function shouldShowVariablePickerOuterCategoryTitle(
	presetType: string,
	hasGlobalStylesPanel: boolean
): boolean {
	if (!hasGlobalStylesPanel) {
		return true;
	}

	return presetType === 'width-size';
}

function VarPickerHeaderActions({
	controlProps,
	triggerAddNew,
}: {
	controlProps: ValueAddonControlProps,
	triggerAddNew: () => void,
}): MixedElement {
	const customAddAction = useVarPickerSingleTypeCustomAddAction(controlProps);
	const showCustomAddButton =
		customAddAction !== null && customAddAction.canAdd === true;
	const headerCustomAddAction =
		showCustomAddButton && customAddAction !== null
			? {
					...customAddAction,
					onClick: triggerAddNew,
				}
			: null;

	return (
		<>
			{(canUnlinkVariable(controlProps.value) ||
				hasThemeJsonPlainPresetSlug(
					controlProps.themeJsonPlainPresetSlug
				)) && (
				<Button
					tabIndex="-1"
					size={'extra-small'}
					onClick={controlProps.handleOnUnlinkVar}
					style={{ padding: '5px' }}
					label={__('Unlink Variable Value', 'blockera')}
				>
					<Icon icon="unlink" iconSize="20" />
				</Button>
			)}

			{(isValid(controlProps.value) ||
				hasThemeJsonPlainPresetSlug(
					controlProps.themeJsonPlainPresetSlug
				)) && (
				<Button
					tabIndex="-1"
					size={'extra-small'}
					onClick={controlProps.handleOnClickRemove}
					style={{ padding: '5px' }}
					label={__('Remove variable', 'blockera')}
				>
					<Icon icon="trash" iconSize="20" />
				</Button>
			)}

			{headerCustomAddAction !== null && (
				<VarPickerCustomAddButton
					customAddAction={headerCustomAddAction}
					dataTest="variable-picker-header-add-custom-variable"
				/>
			)}
		</>
	);
}

function VarPickerSearchEmptyStateContainer({
	controlProps,
	searchQuery,
	onClear,
	triggerAddNew,
}: {
	controlProps: ValueAddonControlProps,
	searchQuery: string,
	onClear: () => void,
	triggerAddNew: () => void,
}): MixedElement {
	const customAddAction = useVarPickerSingleTypeCustomAddAction(controlProps);
	const onAddNew =
		customAddAction !== null && customAddAction.canAdd === true
			? triggerAddNew
			: null;

	return (
		<VarPickerSearchEmptyState
			searchQuery={searchQuery}
			onClear={onClear}
			onAddNew={onAddNew}
			addNewDisabled={customAddAction?.disabled === true}
		/>
	);
}

function VariablePickerPresetPanel({
	presetType,
	controlProps,
	catalogItems,
	catalogLabel,
	PresetPanel,
	pickerProps,
	omitRepeaterSectionLabel,
}: {
	presetType: string,
	controlProps: ValueAddonControlProps,
	catalogItems: Array<any>,
	catalogLabel: string,
	PresetPanel: React$ComponentType<any>,
	pickerProps: ValueAddonControlProps['pickerProps'],
	omitRepeaterSectionLabel?: boolean,
}): MixedElement {
	const controlPropsRef = useRef(controlProps);
	controlPropsRef.current = controlProps;

	const controlPropsSelectionKey = useMemo(
		() => ({
			value: controlProps?.value,
			themeJsonPlainPresetSlug: controlProps?.themeJsonPlainPresetSlug,
			variableTypes: controlProps?.variableTypes,
		}),
		[
			controlProps?.value,
			controlProps?.themeJsonPlainPresetSlug,
			controlProps?.variableTypes,
		]
	);

	const presetContextValue = useMemo(
		() => ({
			active: true,
			variableType: presetType,
			controlProps: controlPropsRef.current,
			controlPropsRef,
			catalogItems,
			catalogLabel,
			spacingPresetPreviewUsage:
				presetType === 'spacing'
					? pickerProps?.spacingPresetPreviewUsage
					: undefined,
			colorPresetPreviewUsage:
				presetType === 'color'
					? pickerProps?.colorPresetPreviewUsage
					: undefined,
			filterPresetPreviewUsage:
				presetType === 'filter'
					? pickerProps?.filterPresetPreviewUsage
					: undefined,
			borderPresetPreviewUsage:
				presetType === 'border'
					? pickerProps?.borderPresetPreviewUsage
					: undefined,
			borderRadiusPresetPreviewUsage:
				presetType === 'border-radius'
					? pickerProps?.borderRadiusPresetPreviewUsage
					: undefined,
			gradientPresetPreviewUsage:
				presetType === 'linear-gradient' ||
				presetType === 'radial-gradient'
					? pickerProps?.gradientPresetPreviewUsage
					: undefined,
			omitRepeaterSectionLabel,
		}),
		[
			presetType,
			catalogItems,
			catalogLabel,
			controlPropsSelectionKey,
			pickerProps?.spacingPresetPreviewUsage,
			pickerProps?.colorPresetPreviewUsage,
			pickerProps?.filterPresetPreviewUsage,
			pickerProps?.borderPresetPreviewUsage,
			pickerProps?.borderRadiusPresetPreviewUsage,
			pickerProps?.gradientPresetPreviewUsage,
			omitRepeaterSectionLabel,
		]
	);

	return (
		<VarPickerPresetContext.Provider value={presetContextValue}>
			<PresetPanel />
		</VarPickerPresetContext.Provider>
	);
}

const MemoizedVariablePickerPresetPanel = memo<{
	presetType: string,
	controlProps: ValueAddonControlProps,
	catalogItems: Array<any>,
	catalogLabel: string,
	PresetPanel: React$ComponentType<any>,
	pickerProps: ValueAddonControlProps['pickerProps'],
	omitRepeaterSectionLabel?: boolean,
}>(VariablePickerPresetPanel);

export default function ({
	controlProps,
	onClose,
}: {
	controlProps: ValueAddonControlProps,
	onClose?: () => void,
}): MixedElement {
	const controlVariableTypes = controlProps.variableTypes || [];
	const variablePickerSectionKeys = useSelect(
		(wpSelect) =>
			buildVariablePickerSectionKeys(
				controlVariableTypes,
				wpSelect(STORE_NAME).getVariableGroups()
			),
		[controlVariableTypes]
	);
	const supplementalSections =
		getSupplementalCustomVariableSections(controlProps);
	const [searchQuery, setSearchQuery] = useState('');
	const searchControlName = useRef(
		`blockera-var-picker-search-${Math.random().toString(36).slice(2, 11)}`
	).current;
	const searchControlContextValue = useMemo(
		() => ({
			name: searchControlName,
			value: searchQuery,
		}),
		[searchControlName, searchQuery]
	);
	const normalizedSearch = useMemo(
		() => normalizeVariablePickerSearchQuery(searchQuery),
		[searchQuery]
	);
	const hasAnySearchMatches = useMemo(
		() =>
			variablePickerHasAnySearchMatches(
				variablePickerSectionKeys,
				controlVariableTypes,
				supplementalSections,
				normalizedSearch
			),
		[
			variablePickerSectionKeys,
			controlVariableTypes,
			supplementalSections,
			normalizedSearch,
		]
	);
	const isSearchActive = normalizedSearch !== '';
	const showSearchEmptyState = isSearchActive && !hasAnySearchMatches;
	const pendingAddSearchSeedRef = useRef<?string>(null);
	const captureAddSearchSeed = useCallback(() => {
		if (!isSearchActive || hasAnySearchMatches) {
			return;
		}

		const trimmed = searchQuery.trim();
		if (trimmed !== '') {
			pendingAddSearchSeedRef.current = trimmed;
		}
	}, [hasAnySearchMatches, isSearchActive, searchQuery]);
	const consumeAddSearchSeed = useCallback((): ?string => {
		const seed = pendingAddSearchSeedRef.current;
		pendingAddSearchSeedRef.current = null;
		return seed ?? null;
	}, []);
	const registeredCustomAddActionRef =
		useRef<?VarPickerCustomAddAction>(null);
	const handleCustomAddActionChange = useCallback(
		(action: VarPickerCustomAddAction) => {
			registeredCustomAddActionRef.current = action;
		},
		[]
	);
	const clearSearch = useCallback(() => {
		setSearchQuery('');
	}, []);
	const triggerAddNew = useVarPickerAddWithSearchClear(
		isSearchActive,
		clearSearch,
		registeredCustomAddActionRef,
		{ captureSearchSeed: captureAddSearchSeed }
	);
	const searchContextValue = useMemo(
		() => ({
			deferSectionSearchEmptyState: isSearchActive,
			consumeAddSearchSeed,
			searchQuery,
			normalizedSearchQuery: normalizedSearch,
		}),
		[isSearchActive, consumeAddSearchSeed, searchQuery, normalizedSearch]
	);
	const popoverClassName = useMemo(() => {
		const typeClassNames = [];
		const seen = new Set<string>();
		for (const sectionKey of variablePickerSectionKeys) {
			const resolved = resolveVariablePickerRow(
				sectionKey,
				controlVariableTypes
			);
			if (!resolved) {
				continue;
			}
			const className = variablePickerPopoverTypeClassName(
				resolved.effectiveType
			);
			if (className !== '' && !seen.has(className)) {
				seen.add(className);
				typeClassNames.push(className);
			}
		}
		return classNames(
			controlInnerClassNames('popover-variables'),
			variablePopoverModeClassName('picker'),
			...typeClassNames
		);
	}, [variablePickerSectionKeys, controlVariableTypes]);
	const popoverContentRef = useRef<?HTMLElement>(null);
	const [summarySlot, setSummarySlot] = useState<?HTMLElement>(null);
	const isClosingRef = useRef(false);

	const markVarPickerClosing = useCallback(() => {
		markPopoverClosing(getPopoverRoot(popoverContentRef.current));
	}, []);

	const handleOnClickVar = useCallback(
		(
			data: Parameters<ValueAddonControlProps['handleOnClickVar']>[0],
			options?: Parameters<ValueAddonControlProps['handleOnClickVar']>[1]
		) => {
			if (!options?.keepPickerOpen) {
				markVarPickerClosing();
			}

			controlProps.handleOnClickVar(data, options);
		},
		[controlProps, markVarPickerClosing]
	);

	const controlPropsWithPickerClose = useMemo(
		() => ({
			...controlProps,
			handleOnClickVar,
		}),
		[controlProps, handleOnClickVar]
	);

	const handleClose = useCallback(() => {
		if (isClosingRef.current) {
			return;
		}
		isClosingRef.current = true;
		markVarPickerClosing();

		if (onClose) {
			onClose();
		}
		controlProps.setOpen('');
	}, [controlProps, markVarPickerClosing, onClose]);

	useLayoutEffect(() => {
		registerPopoverOpen(getPopoverRoot(popoverContentRef.current));

		return () => {
			markVarPickerClosing();
		};
	}, [markVarPickerClosing]);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape' || event.defaultPrevented) {
				return;
			}

			const popoverRoot = getPopoverRoot(popoverContentRef.current);
			if (!popoverRoot) {
				return;
			}

			if (hasNestedOverlayOpenAsideFrom(popoverRoot)) {
				return;
			}

			handleClose();
			event.preventDefault();
			event.stopPropagation();
		};

		const handlePointerDown = (event: MouseEvent) => {
			const popoverRoot = getPopoverRoot(popoverContentRef.current);
			if (!popoverRoot) {
				return;
			}

			if (isOtherPopoverClosing(popoverRoot)) {
				return;
			}

			if (
				isElementInsideVariablePickerSelectionTarget(event.target) ||
				isElementInsideVariablePickerPopover(event.target)
			) {
				return;
			}

			if (isPopoverDismissIgnoredTarget(popoverRoot, event.target)) {
				return;
			}

			handleClose();
		};

		document.addEventListener('keydown', handleEscape, true);
		document.addEventListener('mousedown', handlePointerDown, true);

		return () => {
			document.removeEventListener('keydown', handleEscape, true);
			document.removeEventListener('mousedown', handlePointerDown, true);
			if (!isClosingRef.current && onClose) {
				onClose();
			}
		};
	}, [handleClose, onClose]);

	const variablePickerSections = variablePickerSectionKeys.map(
		(sectionKey, index) => {
			const resolved = resolveVariablePickerRow(
				sectionKey,
				controlVariableTypes
			);

			if (!resolved) {
				return <Fragment key={`type-${sectionKey}-${index}`} />;
			}

			const { data, effectiveType: presetType } = resolved;
			const isDynamicGroup = isVariablePickerDynamicGroupSection(
				sectionKey,
				controlVariableTypes
			);
			const hasDynamicGroupsForPresetType =
				variablePickerSectionKeys.some((key) => {
					if (
						!isVariablePickerDynamicGroupSection(
							key,
							controlVariableTypes
						)
					) {
						return false;
					}

					const dynamicRow = resolveVariablePickerRow(
						key,
						controlVariableTypes
					);

					return dynamicRow?.effectiveType === presetType;
				});
			const catalogItems = collectCatalogItemsForVariableType(
				presetType,
				data,
				supplementalSections
			);
			const filteredCatalogItems = normalizedSearch
				? catalogItems.filter((item) =>
						variablePickerItemMatchesSearch(item, normalizedSearch)
					)
				: catalogItems;

			const globalStylesPanel = isDynamicGroup
				? null
				: applyFilters(
						VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
						null,
						presetType
					);
			const PresetPanel = isDynamicGroup
				? applyFilters(
						VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
						null,
						presetType
					)
				: globalStylesPanel ||
					applyFilters(
						VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
						null,
						presetType
					);
			const showOuterCategoryTitle =
				isDynamicGroup ||
				hasDynamicGroupsForPresetType ||
				shouldShowVariablePickerOuterCategoryTitle(
					presetType,
					!!globalStylesPanel
				);

			if (!PresetPanel) {
				if (!catalogItems.length) {
					return (
						<PickerCategory
							key={`type-${sectionKey}-${index}`}
							title={data.label}
						>
							<span style={{ opacity: '0.5', fontSize: '12px' }}>
								{__(
									'This variable type is not available in this context.',
									'blockera'
								)}
							</span>
						</PickerCategory>
					);
				}

				if (!filteredCatalogItems.length) {
					if (isSearchActive) {
						return <Fragment key={`type-${sectionKey}-${index}`} />;
					}

					return (
						<PickerCategory
							key={`type-${sectionKey}-${index}`}
							title={data.label}
						>
							<span style={{ opacity: '0.5', fontSize: '12px' }}>
								{__(
									'No variables match your search.',
									'blockera'
								)}
							</span>
						</PickerCategory>
					);
				}

				return (
					<PickerCategory
						key={`type-${sectionKey}-${index}`}
						title={data.label}
					>
						<PresetVariablesSummaryRow
							variableCount={filteredCatalogItems.length}
							hasTaxonomyGroups={false}
							hideViewSelect={normalizedSearch !== ''}
						/>
						{filteredCatalogItems.map((item) => (
							<PickerValueItem
								key={`${presetType}-${item.id}`}
								value={controlPropsWithPickerClose.value}
								data={item}
								onClick={
									controlPropsWithPickerClose.handleOnClickVar
								}
								name={item.name}
								type={presetType}
								valueType="variable"
								isCurrent={
									controlPropsWithPickerClose.value?.settings
										?.id === item.id ||
									(hasThemeJsonPlainPresetSlug(
										controlPropsWithPickerClose.themeJsonPlainPresetSlug
									) &&
										controlPropsWithPickerClose.themeJsonPlainPresetSlug ===
											item.id)
								}
								icon={getVariableIcon({
									type: presetType,
									value:
										typeof item.value === 'string'
											? item.value
											: undefined,
								})}
								status={'active'}
							/>
						))}
					</PickerCategory>
				);
			}

			return (
				<PickerCategory
					key={`type-${sectionKey}-${index}`}
					title={data.label}
					showTitle={showOuterCategoryTitle}
				>
					<div
						className={controlInnerClassNames(
							'var-picker-preset-panel'
						)}
						style={
							{
								// width: '100%',
							}
						}
					>
						<MemoizedVariablePickerPresetPanel
							presetType={presetType}
							controlProps={controlPropsWithPickerClose}
							catalogItems={catalogItems}
							catalogLabel={data.label}
							PresetPanel={PresetPanel}
							pickerProps={
								controlPropsWithPickerClose.pickerProps
							}
							omitRepeaterSectionLabel={
								showOuterCategoryTitle &&
								presetType !== 'width-size'
							}
						/>
					</div>
				</PickerCategory>
			);
		}
	);

	return (
		<VarPickerCustomAddProvider>
			<VarPickerAddActionRefBridge
				controlProps={controlProps}
				onCustomAddActionChange={handleCustomAddActionChange}
			/>
			<Popover
				title={__('Variable picker', 'blockera')}
				placement="left-start"
				onClose={handleClose}
				className={popoverClassName}
				titleButtonsRight={
					<VarPickerHeaderActions
						controlProps={controlProps}
						triggerAddNew={triggerAddNew}
					/>
				}
			>
				<PresetVariablesViewModeProvider>
					<VarPickerSummarySlotProvider slot={summarySlot}>
						<VarPickerSearchContext.Provider
							value={searchContextValue}
						>
							<div
								ref={popoverContentRef}
								data-cy="variable-picker-popover"
								data-test="variable-picker-popover"
							>
								<div
									className={controlInnerClassNames(
										'var-picker-search'
									)}
									style={{ marginBottom: '12px' }}
								>
									<ControlContextProvider
										value={searchControlContextValue}
									>
										<SearchControl
											defaultValue=""
											onChange={setSearchQuery}
											placeholder={__(
												'Search variables…',
												'blockera'
											)}
										/>
									</ControlContextProvider>
								</div>
								<div
									ref={setSummarySlot}
									data-test="var-picker-summary-slot"
									style={
										showSearchEmptyState
											? { display: 'none' }
											: undefined
									}
									aria-hidden={
										showSearchEmptyState ? true : undefined
									}
								/>
								{showSearchEmptyState ? (
									<VarPickerSearchEmptyStateContainer
										controlProps={controlProps}
										searchQuery={searchQuery}
										onClear={clearSearch}
										triggerAddNew={triggerAddNew}
									/>
								) : null}
								<div
									style={
										showSearchEmptyState
											? { display: 'none' }
											: undefined
									}
									aria-hidden={
										showSearchEmptyState ? true : undefined
									}
									data-test={
										showSearchEmptyState
											? 'var-picker-search-hidden-sections'
											: 'var-picker-sections'
									}
								>
									<Flex
										direction="column"
										gap={PRESET_VARIABLES_SECTION_GAP}
									>
										{variablePickerSections}
									</Flex>
								</div>
							</div>
						</VarPickerSearchContext.Provider>
					</VarPickerSummarySlotProvider>
				</PresetVariablesViewModeProvider>
			</Popover>
		</VarPickerCustomAddProvider>
	);
}
