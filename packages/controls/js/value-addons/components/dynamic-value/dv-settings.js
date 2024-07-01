// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { STORE_NAME } from '@blockera/data';
import { isUndefined } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isValid } from '../../utils';
import GearIcon from '../../icons/gear';
import TrashIcon from '../../icons/trash';
import SearchIcon from '../../icons/search';
import { getDynamicValueIcon } from '../../helpers';
import CaretRightIcon from '../../icons/caret-right';
import { ControlContextProvider } from '../../../context';
import type { ValueAddonControlProps } from '../control/types';
import { Button, Popover, BaseControl, RendererControl } from '../../../libs';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const { getDynamicValue } = select(STORE_NAME);

	const item = getDynamicValue(
		controlProps.value.settings.group,
		controlProps.value.name
	);

	const {
		value: {
			settings: { settings = [], name: valueName },
		},
	} = controlProps;

	const contextDefaultValue = settings
		.map((s) => ({ [s.id]: s.defaultValue }))
		.reduce((result, currentObject) => {
			return { ...result, ...currentObject };
		}, {});

	const MappedSettings = () =>
		settings.map((setting, index) => (
			<RendererControl
				key={`${setting?.id}-${index}`}
				{...{
					...setting,
					parentDefaultValue: contextDefaultValue,
				}}
			/>
		));

	return (
		<Popover
			title={__('Dynamic Value Setting', 'blockera')}
			offset={125}
			placement="left-start"
			onClose={() => {
				controlProps.setOpen('');
			}}
			className={controlInnerClassNames('popover-dynamic-values')}
			titleButtonsRight={
				<>
					{isValid(controlProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={controlProps.handleOnClickRemove}
							style={{ padding: '5px' }}
							label={__('Remove', 'blockera')}
						>
							<TrashIcon />
						</Button>
					)}
				</>
			}
		>
			<BaseControl label={__('Type', 'blockera')} columns="columns-2">
				<Button
					size="input"
					contentAlign="left"
					onClick={() => {
						controlProps.setOpen('dv-picker');
					}}
					label={__('Change Dynamic Value', 'blockera')}
					showTooltip={true}
				>
					{getDynamicValueIcon(controlProps.value?.settings?.type)}
					{!isUndefined(item?.label) ? item.label : ''}
					<SearchIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>

			<ControlContextProvider
				value={{
					name: `${valueName}-dv-value`,
					value: contextDefaultValue,
				}}
				type={'nested'}
			>
				<MappedSettings />
			</ControlContextProvider>

			<BaseControl label={__('Advanced', 'blockera')} columns="columns-2">
				<Button
					size="input"
					contentAlign="left"
					onClick={() => {
						controlProps.setOpen('dv-settings-advanced');
					}}
					label={__('Advanced Customization Options', 'blockera')}
					showTooltip={true}
				>
					<GearIcon />
					{__('Customize', 'blockera')}
					<CaretRightIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>
		</Popover>
	);
}
