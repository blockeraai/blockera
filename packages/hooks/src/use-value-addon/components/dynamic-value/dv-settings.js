// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { Button, Popover } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import { getDynamicValueIcon, isValid } from '../../helpers';
import TrashIcon from '../../icons/trash';
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
} from '@publisher/controls';
import SearchIcon from '../../icons/search';
import CaretRightIcon from '../../icons/caret-right';
import GearIcon from '../../icons/gear';
import { isUndefined } from '@publisher/utils';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const [isOpenDVSettingsAdv, setIsOpenDVSettingsAdv] = useState(false);

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
						controlProps.setOpen('dv');
					}}
				>
					{getDynamicValueIcon(controlProps.value?.settings?.type)}
					{controlProps.value?.settings?.name}
					<SearchIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>

			<BaseControl
				label={__('Advanced', 'publisher-core')}
				columns="columns-2"
			>
				<Button
					size="input"
					contentAlign="left"
					onClick={() => {
						setIsOpenDVSettingsAdv(!isOpenDVSettingsAdv);
					}}
				>
					<GearIcon />
					{__('Customize', 'publisher-core')}
					<CaretRightIcon style={{ marginLeft: 'auto' }} />
				</Button>
			</BaseControl>

			{isOpenDVSettingsAdv && (
				<Popover
					title={__('Advanced Setting', 'publisher-core')}
					offset={25}
					placement="left-start"
					onClose={() => {
						setIsOpenDVSettingsAdv(false);
					}}
					className={controlInnerClassNames('popover-dynamic-values')}
				>
					<ControlContextProvider
						value={{
							name: 'dv-prepend',
							value: !isUndefined(
								controlProps.value?.settings?.prepend
							)
								? controlProps.value?.settings?.prepend
								: '',
						}}
					>
						<InputControl
							label={__('Prepend', 'publisher-core')}
							type="text"
							columns="columns-2"
							defaultValue={''}
							onChange={(prepend) => {
								const newValue = {
									...controlProps.value,
									settings: {
										...controlProps.value.settings,
										prepend,
									},
								};
								controlProps.setValue(newValue);
								controlProps.onChange(newValue);
							}}
						/>
					</ControlContextProvider>

					<ControlContextProvider
						value={{
							name: 'dv-append',
							value: !isUndefined(
								controlProps.value?.settings?.append
							)
								? controlProps.value?.settings?.append
								: '',
						}}
					>
						<InputControl
							label={__('Append', 'publisher-core')}
							type="text"
							columns="columns-2"
							defaultValue={''}
							onChange={(append) => {
								const newValue = {
									...controlProps.value,
									settings: {
										...controlProps.value.settings,
										append,
									},
								};
								controlProps.setValue(newValue);
								controlProps.onChange(newValue);
							}}
						/>
					</ControlContextProvider>

					<ControlContextProvider
						value={{
							name: 'dv-fallback',
							value: !isUndefined(
								controlProps.value?.settings?.fallback
							)
								? controlProps.value?.settings?.fallback
								: '',
						}}
					>
						<InputControl
							label={__('Fallback', 'publisher-core')}
							type="text"
							columns="columns-2"
							defaultValue={''}
							onChange={(fallback) => {
								const newValue = {
									...controlProps.value,
									settings: {
										...controlProps.value.settings,
										fallback,
									},
								};
								controlProps.setValue(newValue);
								controlProps.onChange(newValue);
							}}
						/>
					</ControlContextProvider>

					<ControlContextProvider
						value={{
							name: 'dv-limit',
							value: !isUndefined(
								controlProps.value?.settings?.limit
							)
								? controlProps.value?.settings?.limit
								: '',
						}}
					>
						<InputControl
							label={__('Limit', 'publisher-core')}
							desc={__('test', 'publisher-core')}
							unitType="text-length"
							columns="columns-2"
							defaultValue={''}
							arrows={true}
							onChange={(limit) => {
								const newValue = {
									...controlProps.value,
									settings: {
										...controlProps.value.settings,
										limit,
									},
								};
								controlProps.setValue(newValue);
								controlProps.onChange(newValue);
							}}
						/>
					</ControlContextProvider>
				</Popover>
			)}
		</Popover>
	);
}
