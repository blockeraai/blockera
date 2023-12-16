// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { Popover } from '@publisher/components';
import {
	ControlContextProvider,
	InputControl,
	LinkControl,
	SearchReplaceControl,
	BaseControl,
} from '@publisher/controls';
import { isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	return (
		<Popover
			title={__('Advanced Setting', 'publisher-core')}
			offset={25}
			placement="left-start"
			onClose={() => {
				controlProps.setOpen('');
			}}
			className={controlInnerClassNames('popover-dynamic-values')}
		>
			<ControlContextProvider
				value={{
					name: 'dv-prepend',
					value: !isUndefined(controlProps.value?.settings?.prepend)
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
					value: !isUndefined(controlProps.value?.settings?.append)
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
					value: !isUndefined(controlProps.value?.settings?.fallback)
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
					value: !isUndefined(controlProps.value?.settings?.limit)
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

			<ControlContextProvider
				value={{
					name: 'dv-link',
					value: !isUndefined(controlProps.value?.settings?.link)
						? controlProps.value?.settings?.link
						: {},
				}}
			>
				<LinkControl
					columns="columns-2"
					label={__('Link', 'publisher-core')}
					//
					onChange={(link) => {
						const newValue = {
							...controlProps.value,
							settings: {
								...controlProps.value.settings,
								link,
							},
						};
						controlProps.setValue(newValue);
						controlProps.onChange(newValue);
					}}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: 'dv-search',
					value: !isUndefined(controlProps.value?.settings?.search)
						? controlProps.value?.settings?.search
						: [],
				}}
				storeName={'publisher-core/controls/repeater'}
			>
				<BaseControl controlName="dv-search" columns="columns-1">
					<SearchReplaceControl
						label="Search and Replace"
						onChange={() => {
							// const newValue = {
							// 	...controlProps.value,
							// 	settings: {
							// 		...controlProps.value.settings,
							// 		search,
							// 	},
							// };
							//
							// controlProps.setValue(newValue);
							// controlProps.onChange(newValue);
						}}
						defaultRepeaterItemValue={{
							search: '',
							replace: '',
							isVisible: true,
						}}
					/>
				</BaseControl>
			</ControlContextProvider>
		</Popover>
	);
}
