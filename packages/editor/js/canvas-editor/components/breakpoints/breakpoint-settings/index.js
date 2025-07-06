// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import {
	RepeaterControl,
	PromotionPopover,
	ControlContextProvider,
} from '@blockera/controls';
import { defaultItemValue } from '@blockera/controls/js/libs/repeater-control/default-item-value';
import { STORE_NAME as REPEATER_STORE_NAME } from '@blockera/controls/js/libs/repeater-control/store/constants';

/**
 * Internal dependencies
 */
import Header from './header';
import Fields from './fields';
import type { BreakpointSettingsComponentProps } from '../types';

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
	native: true,
	type: '',
	force: false,
	label: '',
	attributes: {},
};

export default function ({
	onClick,
	onChange,
	breakpoints,
}: BreakpointSettingsComponentProps): MixedElement {
	const { getBreakpoints } = select('blockera/editor');
	const { getCurrentUser } = select('core');
	const { id: userId } = getCurrentUser();

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
				defaultRepeaterItemValue={applyFilters(
					'blockera.breakpoints.defaultRepeaterItemValue',
					defaultRepeaterItemValue
				)}
				repeaterItemHeader={(props) => (
					<Header {...{ ...props, onClick }} />
				)}
				repeaterItemChildren={Fields}
				onChange={(value) => {
					onChange('breakpoints', value);

					apiFetch({
						path: '/blockera/v1/users',
						method: 'POST',
						headers: {
							'X-Blockera-Nonce': blockeraEditorNonce,
						},
						data: {
							user_id: userId,
							settings: {
								breakpoints: value,
							},
						},
					});
				}}
				addNewButtonDataTest={'add-new-breakpoint'}
				PromoComponent={({
					onClose = () => {},
					isOpen = false,
				}): MixedElement | null => {
					return (
						<PromotionPopover
							heading={__('Advanced Breakpoints', 'blockera')}
							featuresList={[
								__('Custom breakpoints', 'blockera'),
								__('Unlimited breakpoints', 'blockera'),
								__('Advanced responsive features', 'blockera'),
								__('Breakpoint inheritance', 'blockera'),
							]}
							isOpen={isOpen}
							onClose={onClose}
						/>
					);
				}}
				defaultValue={getBreakpoints()}
			/>
		</ControlContextProvider>
	);
}
