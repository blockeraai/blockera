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
import type { PointerProps } from '../pointer/types';
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

export default function DynamicValueSettingsUI({
	pointerProps,
}: {
	pointerProps: PointerProps,
}): Element<any> {
	const [isOpenDVSettingsAdv, setIsOpenDVSettingsAdv] = useState(false);

	return (
		<Popover
			title={__('Dynamic Value Setting', 'publisher-core')}
			offset={125}
			placement="left-start"
			onClose={() => {
				pointerProps.setOpen('');
			}}
			className={controlInnerClassNames('popover-dynamic-values')}
			titleButtonsRight={
				<>
					{isValid(pointerProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={pointerProps.handleOnClickRemove}
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
						pointerProps.setOpen('dv');
					}}
				>
					{getDynamicValueIcon(pointerProps.value?.settings?.type)}
					{pointerProps.value?.settings?.name}
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
								pointerProps.value?.settings?.prepend
							)
								? pointerProps.value?.settings?.prepend
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
									...pointerProps.value,
									settings: {
										...pointerProps.value.settings,
										prepend,
									},
								};
								pointerProps.setValue(newValue);
								pointerProps.onChange(newValue);
							}}
						/>
					</ControlContextProvider>

					<ControlContextProvider
						value={{
							name: 'dv-append',
							value: !isUndefined(
								pointerProps.value?.settings?.append
							)
								? pointerProps.value?.settings?.append
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
									...pointerProps.value,
									settings: {
										...pointerProps.value.settings,
										append,
									},
								};
								pointerProps.setValue(newValue);
								pointerProps.onChange(newValue);
							}}
						/>
					</ControlContextProvider>

					<ControlContextProvider
						value={{
							name: 'dv-fallback',
							value: !isUndefined(
								pointerProps.value?.settings?.fallback
							)
								? pointerProps.value?.settings?.fallback
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
									...pointerProps.value,
									settings: {
										...pointerProps.value.settings,
										fallback,
									},
								};
								pointerProps.setValue(newValue);
								pointerProps.onChange(newValue);
							}}
						/>
					</ControlContextProvider>

					<ControlContextProvider
						value={{
							name: 'dv-limit',
							value: !isUndefined(
								pointerProps.value?.settings?.limit
							)
								? pointerProps.value?.settings?.limit
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
									...pointerProps.value,
									settings: {
										...pointerProps.value.settings,
										limit,
									},
								};
								pointerProps.setValue(newValue);
								pointerProps.onChange(newValue);
							}}
						/>
					</ControlContextProvider>
				</Popover>
			)}
		</Popover>
	);
}
