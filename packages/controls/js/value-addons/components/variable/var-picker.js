// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment, useMemo, useRef, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

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
import { PickerCategory, PickerValueItem } from '../index';
import type { ValueAddonControlProps } from '../control/types';
import { VarPickerPresetContext } from './var-picker-preset-context';
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

export default function ({
	controlProps,
	onClose,
	popoverOffset = 125,
}: {
	controlProps: ValueAddonControlProps,
	onClose?: () => void,
	popoverOffset?: number,
}): Element<any> {
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
		<Popover
			title={__('Variable Picker', 'blockera')}
			offset={popoverOffset}
			placement="left-start"
			onClose={() => {
				controlProps.setOpen('');
				if (onClose) {
					onClose();
				}
			}}
			className={controlInnerClassNames('popover-variables')}
			titleButtonsRight={
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
				</>
			}
		>
			<div
				data-cy="variable-picker-popover"
				data-test="variable-picker-popover"
			>
				<div
					className={controlInnerClassNames('var-picker-search')}
					style={{ marginBottom: '12px' }}
				>
					<ControlContextProvider value={searchControlContextValue}>
						<SearchControl
							defaultValue=""
							onChange={setSearchQuery}
							placeholder={__('Search variables…', 'blockera')}
						/>
					</ControlContextProvider>
				</div>
				<Flex direction="column" gap="25px">
					{variablePickerSections}
				</Flex>
			</div>
		</Popover>
	);
}
