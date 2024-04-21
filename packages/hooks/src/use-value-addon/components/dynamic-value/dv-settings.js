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
import { controlInnerClassNames } from '@blockera/classnames';
import { Button, Popover } from '@blockera/components';
import {
	BaseControl,
	ControlContextProvider,
	RendererControl,
} from '@blockera/controls';
import { generateExtensionId } from '@blockera/extensions/src/libs/utils';
import { useBlockContext } from '@blockera/extensions/src/hooks/context';
import { STORE_NAME } from '@blockera/core-data';
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import { getDynamicValueIcon, isValid } from '../../helpers';
import TrashIcon from '../../icons/trash';
import SearchIcon from '../../icons/search';
import CaretRightIcon from '../../icons/caret-right';
import GearIcon from '../../icons/gear';

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

	const { block } = useBlockContext();

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
			title={__('Dynamic Value Setting', 'blockera-core')}
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
							label={__('Remove', 'blockera-core')}
						>
							<TrashIcon />
						</Button>
					)}
				</>
			}
		>
			<BaseControl
				label={__('Type', 'blockera-core')}
				columns="columns-2"
			>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => {
						controlProps.setOpen('dv-picker');
					}}
					label={__('Change Dynamic Value', 'blockera-core')}
					showTooltip={true}
				>
					{getDynamicValueIcon(controlProps.value?.settings?.type)}
					{!isUndefined(item?.label) ? item.label : ''}
					<SearchIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, `${valueName}-dv-value`),
					value: contextDefaultValue,
				}}
				type={'nested'}
			>
				<MappedSettings />
			</ControlContextProvider>

			<BaseControl
				label={__('Advanced', 'blockera-core')}
				columns="columns-2"
			>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => {
						controlProps.setOpen('dv-settings-advanced');
					}}
					label={__(
						'Advanced Customization Options',
						'blockera-core'
					)}
					showTooltip={true}
				>
					<GearIcon />
					{__('Customize', 'blockera-core')}
					<CaretRightIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>
		</Popover>
	);
}
