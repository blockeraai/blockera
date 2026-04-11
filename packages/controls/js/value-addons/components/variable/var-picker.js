// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	STORE_NAME,
	getCustomGlobalStylePresetVariables,
	type DynamicVariableGroup,
} from '@blockera/data';
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { canUnlinkVariable, getVariableCategory } from '../../helpers';
import { isValid } from '../../utils';
import type { VariableCategoryDetail } from '../../types';
import { PickerCategory } from '../index';
import type { ValueAddonControlProps } from '../control/types';
import { Button, Flex, Popover } from '../../../';
import { VariableManager } from './variable-manager';

/** @see packages/editor/js/editor/register-var-picker-global-styles-panels.js */
export const VAR_PICKER_PRESET_PANEL_FILTER =
	'blockera.controls.var-picker.resolve-preset-panel';

export default function ({
	controlProps,
	onClose,
	popoverOffset = 125,
}: {
	controlProps: ValueAddonControlProps,
	onClose?: () => void,
	popoverOffset?: number,
}): Element<any> {
	const { getVariableGroups } = select(STORE_NAME);

	const variableTypes = [
		...Object.keys(getVariableGroups()),
		...controlProps.variableTypes,
	];

	const CustomVariables = (): ?Element<any> => {
		const sections = controlProps.variableTypes
			.map((type) => {
				if (applyFilters(VAR_PICKER_PRESET_PANEL_FILTER, null, type)) {
					return null;
				}

				const cat = getVariableCategory(type);

				if (cat.notFound) {
					return null;
				}

				const mainItems = !Array.isArray(cat.items)
					? Object.values(cat.items || {})
					: cat.items || [];

				const mainIds = new Set(
					mainItems.map((i) => i.id).filter(Boolean)
				);

				const customItems = getCustomGlobalStylePresetVariables(
					type
				).filter(
					(i) =>
						i.id &&
						!mainIds.has(i.id) &&
						i.value !== undefined &&
						i.value !== ''
				);

				if (!customItems.length) {
					return null;
				}

				return {
					type,
					label: cat.label,
					items: customItems,
				};
			})
			.filter(Boolean);

		if (!sections.length) {
			return null;
		}

		return (
			<PickerCategory
				key="type-custom-variables"
				title={__('Custom variables', 'blockera')}
			>
				<Flex direction="column" gap="20px">
					{sections.map((section) => (
						<Flex
							key={`custom-section-${section.type}`}
							direction="column"
							gap="10px"
						>
							<VariableManager
								controlProps={controlProps}
								data={{
									label: section.label,
									items: section.items,
									type: section.type,
								}}
								typeKey={section.type}
								keySuffix="custom-preset"
							/>
						</Flex>
					))}
				</Flex>
			</PickerCategory>
		);
	};

	const Variables = (): Array<Element<any>> => {
		return variableTypes.map((type, index) => {
			let data: DynamicVariableGroup | VariableCategoryDetail =
				getVariableCategory(type);

			if (data?.label === '') {
				const { getVariableGroup } = select(STORE_NAME);

				data = getVariableGroup(type);

				if (
					!data?.type ||
					!controlProps.variableTypes.includes(data.type)
				) {
					return <></>;
				}
			}

			const presetType = data?.type || type;
			const PresetPanel = applyFilters(
				VAR_PICKER_PRESET_PANEL_FILTER,
				null,
				presetType
			);

			if (PresetPanel) {
				return (
					<PickerCategory
						key={`type-${type}-${index}`}
						title={data.label}
					>
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
							<PresetPanel />
						</div>
					</PickerCategory>
				);
			}

			if (data.items?.length === 0) {
				return (
					<PickerCategory
						key={`type-${type}-${index}`}
						title={data.label}
					>
						<span style={{ opacity: '0.5', fontSize: '12px' }}>
							{__('No variable!', 'blockera')}
						</span>
					</PickerCategory>
				);
			}

			return (
				<PickerCategory
					key={`type-${type}-${index}`}
					title={data.label}
				>
					<VariableManager
						controlProps={controlProps}
						data={data}
						typeKey={type}
					/>
				</PickerCategory>
			);
		});
	};

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
			<Flex direction="column" gap="25px">
				<Variables />

				<CustomVariables />
			</Flex>
		</Popover>
	);
}
