// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import { RepeaterControl, ControlContextProvider } from '@blockera/controls';
import { defaultItemValue } from '@blockera/controls/js/libs/repeater-control/default-item-value';
import { STORE_NAME as REPEATER_STORE_NAME } from '@blockera/controls/js/libs/repeater-control/store/constants';

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
	const defaultRepeaterItemValue = {
		...defaultItemValue,
		cloneable: false,
		deletable: false,
		visibilitySupport: false,
		isOpen: false,
		settings: {
			min: '',
			max: '',
			icon: {
				icon: '',
				library: '',
				uploadSVG: '',
			},
			picked: false,
		},
		type: '',
		force: false,
		label: '',
		attributes: {},
	};

	breakpoints = useMemo(() => {
		return Object.fromEntries(
			Object.entries(breakpoints).map(([key, value]) => {
				return [key, mergeObject(defaultRepeaterItemValue, value)];
			})
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [breakpoints]);

	return (
		<ControlContextProvider
			value={{
				name: 'canvas-editor-breakpoints',
				value: breakpoints,
			}}
			storeName={REPEATER_STORE_NAME}
		>
			<RepeaterControl
				isNativeSupport={true}
				popoverTitle={__('Breakpoint Settings', 'blockera')}
				className={controlInnerClassNames('breakpoints-repeater')}
				defaultRepeaterItemValue={defaultRepeaterItemValue}
				repeaterItemHeader={(props) => (
					<Header {...{ ...props, onClick }} />
				)}
				repeaterItemChildren={Fields}
				onChange={(value) => onChange('breakpoints', value)}
				defaultValue={getBreakpoints()}
			/>
		</ControlContextProvider>
	);
}
