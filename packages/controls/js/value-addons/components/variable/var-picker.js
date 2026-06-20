// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	canUnlinkVariable,
	getVariableCategory,
	getVariableIcon,
} from '../../helpers';
import { hasThemeJsonPlainPresetSlug, isValid } from '../../utils';
import { ControlContextProvider } from '../../../context';
import { Button, Flex, Popover, SearchControl } from '../../../libs';
import { PresetVariablesSummaryRow } from './preset-variables-summary-row';
import { PresetVariablesViewModeProvider } from './preset-variables-view-mode';
import { PRESET_VARIABLES_SECTION_GAP } from './preset-variables-section-gap';
import { VarPickerSummarySlotProvider } from './var-picker-summary-slot';
import {
	hasOpenModalOverlay,
	isElementInsideModalOverlay,
} from '../../../libs/modal/overlay-utils';
import { PickerCategory, PickerValueItem } from '../index';
import type { ValueAddonControlProps } from '../control/types';
import { VarPickerPresetContext } from './var-picker-preset-context';
import {
	VarPickerCustomAddProvider,
	useVarPickerCustomAddContext,
} from './var-picker-custom-add-context';
import {
	collectCatalogItemsForVariableType,
	getSupplementalCustomVariableSections,
	normalizeVariablePickerSearchQuery,
	variablePickerItemMatchesSearch,
} from './var-picker-helpers';
import {
	VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
} from './var-picker-constants';

export {
	VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
	VAR_PICKER_PRESET_PANEL_FILTER,
} from './var-picker-constants';

function getVarPickerPopoverRoot(contentRoot: ?HTMLElement): ?HTMLElement {
	if (!contentRoot) {
		return null;
	}
	const popover = contentRoot.closest('.components-popover');
	return popover instanceof HTMLElement ? popover : null;
}

function hasOpenOverlayPopoversAsideFromVarPicker(
	varPickerPopover: HTMLElement
): boolean {
	if (hasOpenModalOverlay()) {
		return true;
	}

	const popovers = document.querySelectorAll('.components-popover');

	for (let i = 0; i < popovers.length; i++) {
		const popover = popovers[i];
		if (popover instanceof HTMLElement && popover !== varPickerPopover) {
			return true;
		}
	}

	return false;
}

function isDismissTargetOutsideVarPicker(
	varPickerPopover: HTMLElement,
	target: EventTarget | null
): boolean {
	if (!target || !(target instanceof Node)) {
		return true;
	}

	if (varPickerPopover.contains(target)) {
		return false;
	}

	if (target instanceof HTMLElement) {
		if (
			target.closest(
				'.blockera-control-value-addon-pointers, [data-cy="value-addon-btn-open"], [data-cy="value-addon-btn"]'
			)
		) {
			return false;
		}

		// Nested menus / color pickers / repeater edit popovers portal outside the var-picker root.
		const clickedPopover = target.closest('.components-popover');
		if (clickedPopover && clickedPopover !== varPickerPopover) {
			return false;
		}

		// SelectControl and similar dropdown surfaces.
		if (target.closest('.components-dropdown__content')) {
			return false;
		}

		// Nested modals (delete confirm, rename, reset dialogs, upgrade prompts, …).
		if (isElementInsideModalOverlay(target)) {
			return false;
		}

		// Host controls (e.g. BoxBorderControl) whose inputs sit beside the picker in the sidebar.
		if (
			target.closest(
				'.blockera-control-box-border, .blockera-control-border'
			)
		) {
			return false;
		}
	}

	return true;
}

function resolveVariablePickerPresetType(type: string): string {
	const data = getVariableCategory(type);
	if (data.notFound) {
		return String(type);
	}
	return data.type || type;
}

function variablePickerPopoverTypeClassName(presetType: string): string {
	const segment = String(presetType).trim().toLowerCase();
	if (segment === '') {
		return '';
	}
	return controlInnerClassNames(`popover-variables-type-${segment}`);
}

function VarPickerHeaderActions({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): MixedElement {
	const customAddCtx = useVarPickerCustomAddContext();
	const customAddAction = customAddCtx?.action;
	const isSingleVariableType =
		(controlProps.variableTypes || []).length === 1;
	const showCustomAddButton =
		isSingleVariableType &&
		customAddAction !== null &&
		customAddAction.canAdd === true;

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

			{showCustomAddButton && customAddAction !== null && (
				<Button
					tabIndex="-1"
					size={'extra-small'}
					data-test="variable-picker-header-add-custom-variable"
					onClick={customAddAction.onClick}
					style={{ padding: '5px' }}
					showTooltip={true}
					tooltipPosition="top"
					label={customAddAction.label}
					disabled={customAddAction.disabled === true}
				>
					<Icon icon="plus" iconSize="20" />
				</Button>
			)}
		</>
	);
}

export default function ({
	controlProps,
	onClose,
}: {
	controlProps: ValueAddonControlProps,
	onClose?: () => void,
}): MixedElement {
	const variableTypes = controlProps.variableTypes || [];
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
	const popoverClassName = useMemo(() => {
		const typeClassNames = [];
		const seen = new Set<string>();
		for (const type of variableTypes) {
			const presetType = resolveVariablePickerPresetType(type);
			const className = variablePickerPopoverTypeClassName(presetType);
			if (className !== '' && !seen.has(className)) {
				seen.add(className);
				typeClassNames.push(className);
			}
		}
		return classNames(
			controlInnerClassNames('popover-variables'),
			...typeClassNames
		);
	}, [variableTypes]);
	const popoverContentRef = useRef<?HTMLElement>(null);
	const [summarySlot, setSummarySlot] = useState<?HTMLElement>(null);
	const isClosingRef = useRef(false);

	const handleClose = useCallback(() => {
		if (isClosingRef.current) {
			return;
		}
		isClosingRef.current = true;

		if (onClose) {
			onClose();
		}
		controlProps.setOpen('');
	}, [controlProps, onClose]);

	const handleFocusOutside = useCallback(
		(event: FocusEvent) => {
			if (hasOpenModalOverlay()) {
				return;
			}

			const varPickerPopover = getVarPickerPopoverRoot(
				popoverContentRef.current
			);
			if (
				varPickerPopover &&
				hasOpenOverlayPopoversAsideFromVarPicker(varPickerPopover)
			) {
				return;
			}

			const related = event?.relatedTarget;
			if (related instanceof HTMLElement) {
				if (isElementInsideModalOverlay(related)) {
					return;
				}

				const root = getVarPickerPopoverRoot(popoverContentRef.current);
				if (root && root.contains(related)) {
					return;
				}

				// Repeater item edit popovers portal outside the picker root.
				const nestedPopover = related.closest('.components-popover');
				if (
					nestedPopover instanceof HTMLElement &&
					varPickerPopover &&
					nestedPopover !== varPickerPopover
				) {
					return;
				}
			}

			handleClose();
		},
		[handleClose]
	);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape' || event.defaultPrevented) {
				return;
			}

			const varPickerPopover = getVarPickerPopoverRoot(
				popoverContentRef.current
			);
			if (!varPickerPopover) {
				return;
			}

			if (hasOpenOverlayPopoversAsideFromVarPicker(varPickerPopover)) {
				return;
			}

			handleClose();
			event.preventDefault();
			event.stopPropagation();
		};

		const handlePointerDown = (event: MouseEvent) => {
			if (hasOpenModalOverlay()) {
				return;
			}

			const varPickerPopover = getVarPickerPopoverRoot(
				popoverContentRef.current
			);
			if (!varPickerPopover) {
				return;
			}

			if (
				!isDismissTargetOutsideVarPicker(varPickerPopover, event.target)
			) {
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

	const variablePickerSections = variableTypes.map((type, index) => {
		const data = getVariableCategory(type);

		if (data.notFound) {
			return <Fragment key={`type-${type}-${index}`} />;
		}

		const presetType = data.type || type;
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

		const globalStylesPanel = applyFilters(
			VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
			null,
			presetType
		);
		const PresetPanel =
			globalStylesPanel ||
			applyFilters(
				VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
				null,
				presetType
			);

		if (!PresetPanel) {
			if (!catalogItems.length) {
				return (
					<PickerCategory
						key={`type-${type}-${index}`}
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
				return (
					<PickerCategory
						key={`type-${type}-${index}`}
						title={data.label}
					>
						<span style={{ opacity: '0.5', fontSize: '12px' }}>
							{__('No variables match your search.', 'blockera')}
						</span>
					</PickerCategory>
				);
			}

			return (
				<PickerCategory
					key={`type-${type}-${index}`}
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
							value={controlProps.value}
							data={item}
							onClick={controlProps.handleOnClickVar}
							name={item.name}
							type={presetType}
							valueType="variable"
							isCurrent={
								controlProps.value?.settings?.id === item.id ||
								(hasThemeJsonPlainPresetSlug(
									controlProps.themeJsonPlainPresetSlug
								) &&
									controlProps.themeJsonPlainPresetSlug ===
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
				key={`type-${type}-${index}`}
				title={data.label}
				showTitle={!globalStylesPanel}
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
					<VarPickerPresetContext.Provider
						value={{
							active: true,
							variableType: presetType,
							controlProps,
							catalogItems,
							catalogLabel: data.label,
							searchQuery,
							spacingPresetPreviewUsage:
								presetType === 'spacing'
									? controlProps.pickerProps
											?.spacingPresetPreviewUsage
									: undefined,
							colorPresetPreviewUsage:
								presetType === 'color'
									? controlProps.pickerProps
											?.colorPresetPreviewUsage
									: undefined,
							filterPresetPreviewUsage:
								presetType === 'filter'
									? controlProps.pickerProps
											?.filterPresetPreviewUsage
									: undefined,
							borderPresetPreviewUsage:
								presetType === 'border'
									? controlProps.pickerProps
											?.borderPresetPreviewUsage
									: undefined,
							borderRadiusPresetPreviewUsage:
								presetType === 'border-radius'
									? controlProps.pickerProps
											?.borderRadiusPresetPreviewUsage
									: undefined,
							gradientPresetPreviewUsage:
								presetType === 'linear-gradient' ||
								presetType === 'radial-gradient'
									? controlProps.pickerProps
											?.gradientPresetPreviewUsage
									: undefined,
						}}
					>
						<PresetPanel />
					</VarPickerPresetContext.Provider>
				</div>
			</PickerCategory>
		);
	});

	return (
		<VarPickerCustomAddProvider>
			<Popover
				title={__('Variable Picker', 'blockera')}
				placement="left-start"
				onClose={handleClose}
				onFocusOutside={handleFocusOutside}
				className={popoverClassName}
				titleButtonsRight={
					<VarPickerHeaderActions controlProps={controlProps} />
				}
			>
				<PresetVariablesViewModeProvider>
					<VarPickerSummarySlotProvider slot={summarySlot}>
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
							/>
							<Flex
								direction="column"
								gap={PRESET_VARIABLES_SECTION_GAP}
							>
								{variablePickerSections}
							</Flex>
						</div>
					</VarPickerSummarySlotProvider>
				</PresetVariablesViewModeProvider>
			</Popover>
		</VarPickerCustomAddProvider>
	);
}
