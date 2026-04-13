// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
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
import { isValid } from '../../utils';
import { Button, Flex, Popover } from '../../../libs';
import { PickerCategory, PickerValueItem } from '../index';
import type { ValueAddonControlProps } from '../control/types';
import { VarPickerPresetContext } from './var-picker-preset-context';
import {
	collectCatalogItemsForVariableType,
	getSupplementalCustomVariableSections,
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
	const variableTypes = [...new Set(controlProps.variableTypes || [])].sort();
	const supplementalSections =
		getSupplementalCustomVariableSections(controlProps);

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

			return (
				<PickerCategory
					key={`type-${type}-${index}`}
					title={data.label}
				>
					{catalogItems.map((item) => (
						<PickerValueItem
							key={`${presetType}-${item.id}`}
							value={controlProps.value}
							data={item}
							onClick={controlProps.handleOnClickVar}
							name={item.name}
							type={presetType}
							valueType="variable"
							isCurrent={
								controlProps.value?.settings?.id === item.id
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
			<PickerCategory key={`type-${type}-${index}`} title={data.label}>
				<div
					className={controlInnerClassNames(
						'var-picker-preset-panel'
					)}
					style={{
						maxHeight: 'min(70vh, 520px)',
						overflow: 'auto',
						width: '100%',
					}}
				>
					<VarPickerPresetContext.Provider
						value={{
							active: true,
							variableType: presetType,
							controlProps,
							catalogItems,
							catalogLabel: data.label,
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
					{canUnlinkVariable(controlProps.value) && (
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

					{isValid(controlProps.value) && (
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
				<Flex direction="column" gap="25px">
					{variablePickerSections}
				</Flex>
			</div>
		</Popover>
	);
}
