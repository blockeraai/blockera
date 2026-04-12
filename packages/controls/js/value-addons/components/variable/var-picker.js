// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { canUnlinkVariable, getVariableCategory } from '../../helpers';
import { isValid } from '../../utils';
import { PickerCategory } from '../index';
import type { ValueAddonControlProps } from '../control/types';
import { Button, Flex, Popover } from '../../../';
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

import { VarPickerPresetContext } from './var-picker-preset-context';

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
	const variableTypes = [...new Set(controlProps.variableTypes || [])].sort();

	const variablePickerSections = variableTypes.map((type, index) => {
		const data = getVariableCategory(type);

		if (data.notFound) {
			return <Fragment key={`type-${type}-${index}`} />;
		}

		const presetType = data.type || type;
		const PresetPanel = applyFilters(
			VAR_PICKER_PRESET_PANEL_FILTER,
			null,
			presetType
		);

		if (!PresetPanel) {
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
			<Flex direction="column" gap="25px">
				{variablePickerSections}
			</Flex>
		</Popover>
	);
}
