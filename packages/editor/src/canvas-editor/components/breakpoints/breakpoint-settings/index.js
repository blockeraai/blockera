// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { RepeaterControl, ControlContextProvider } from '@blockera/controls';
import { defaultItemValue } from '@blockera/controls/src/libs/repeater-control';
import { STORE_NAME as REPEATER_STORE_NAME } from '@blockera/controls/src/libs/repeater-control/store';
import { controlInnerClassNames } from '@blockera/classnames';
import defaultBreakpoints from '@blockera/extensions/src/libs/block-states/default-breakpoints';

/**
 * Internal dependencies
 */
import Header from './header';
import Fields from './fields';
import type { BreakpointSettingsComponentProps } from '../types';

export default function ({
	onClick,
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
				popoverTitle={__('Breakpoint Settings', 'blockera-core')}
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
				repeaterItemHeader={(props) => (
					<Header {...{ ...props, onClick }} />
				)}
				repeaterItemChildren={Fields}
				onChange={(newValue) => onChange('breakpoints', newValue)}
				defaultValue={defaultBreakpoints()}
			/>
		</ControlContextProvider>
	);
}
