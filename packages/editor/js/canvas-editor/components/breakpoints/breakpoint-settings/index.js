// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { RepeaterControl, ControlContextProvider } from '@blockera/controls';
import { defaultItemValue } from '@blockera/controls/js/libs/repeater-control/default-item-value';
import { STORE_NAME as REPEATER_STORE_NAME } from '@blockera/controls/js/libs/repeater-control/store/constants';
import { controlInnerClassNames } from '@blockera/classnames';

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
	const { getBreakpoints } = select('blockera/editor');
	return (
		<ControlContextProvider
			value={{
				name: 'canas-editor-breakpoints',
				value: breakpoints,
			}}
			storeName={REPEATER_STORE_NAME}
		>
			<RepeaterControl
				popoverTitle={__('Breakpoint Settings', 'blockera')}
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
				defaultValue={getBreakpoints()}
			/>
		</ControlContextProvider>
	);
}
