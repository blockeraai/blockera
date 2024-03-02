// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { Button, Popover } from '@publisher/components';
import {
	BaseControl,
	ControlContextProvider,
	RendererControl,
} from '@publisher/controls';
import { generateExtensionId } from '@publisher/extensions/src/libs/utils';
import { useBlockContext } from '@publisher/extensions/src/hooks/context';
import { STORE_NAME } from '@publisher/core-data';
import { isUndefined } from '@publisher/utils';

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
			title={__('Dynamic Value Setting', 'publisher-core')}
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
							label={__('Remove', 'publisher-core')}
						>
							<TrashIcon />
						</Button>
					)}
				</>
			}
		>
			<BaseControl
				label={__('Type', 'publisher-core')}
				columns="columns-2"
			>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => {
						controlProps.setOpen('dv-picker');
					}}
					label={__('Change Dynamic Value', 'publisher-core')}
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
				label={__('Advanced', 'publisher-core')}
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
						'publisher-core'
					)}
					showTooltip={true}
				>
					<GearIcon />
					{__('Customize', 'publisher-core')}
					<CaretRightIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>
		</Popover>
	);
}
