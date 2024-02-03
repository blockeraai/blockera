// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { RepeaterControl, ControlContextProvider } from '@publisher/controls';
import { defaultItemValue } from '@publisher/controls/src/libs/repeater-control';
import { STORE_NAME as REPEATER_STORE_NAME } from '@publisher/controls/src/libs/repeater-control/store';
import { controlInnerClassNames } from '@publisher/classnames';
import defaultBreakpoints from '@publisher/extensions/src/libs/block-states/default-breakpoints';

/**
 * Internal dependencies
 */
import Header from './header';
import Fields from './fields';
import type { BreakpointSettingsComponentProps } from '../types';

export default function ({
	onChange,
	breakpoints,
}: BreakpointSettingsComponentProps): MixedElement {
	return (
		<ControlContextProvider
			value={{
				name: 'canas-editor-breakpoints',
				value: breakpoints,
			}}
			storeName={REPEATER_STORE_NAME}
		>
			<RepeaterControl
				popoverTitle={__('Breakpoint Settings', 'publisher-core')}
				className={controlInnerClassNames('breakpoints-repeater')}
				defaultRepeaterItemValue={{
					...defaultItemValue,
					isOpen: false,
					settings: {
						min: '',
						max: '',
					},
					type: '',
					force: false,
					label: '',
					attributes: {},
				}}
				repeaterItemHeader={Header}
				repeaterItemChildren={Fields}
				onChange={(newValue) => onChange('breakpoints', newValue)}
				defaultValue={defaultBreakpoints()}
			/>
		</ControlContextProvider>
	);
}
