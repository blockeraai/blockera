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
import {
	controlInnerClassNames,
	controlClassNames,
} from '@blockera/classnames';
import {
	RepeaterControl,
	PromotionPopover,
	cleanupRepeaterItem,
	ControlContextProvider,
} from '@blockera/controls';
import { defaultItemValue } from '@blockera/controls/js/libs/repeater-control/default-item-value';
import { STORE_NAME as REPEATER_STORE_NAME } from '@blockera/controls/js/libs/repeater-control/store/constants';

/**
 * Internal dependencies
 */
import Header from './header';
import Fields from './fields';
import { getBaseBreakpoint } from '../helpers';
import type { BreakpointSettingsComponentProps } from '../types';

const defaultRepeaterItemValue = {
	...defaultItemValue,
	cloneable: false,
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
			Object.entries(breakpoints).map(([key, value]) => [
				key,
				mergeObject(defaultRepeaterItemValue, value),
			])
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
				id="breakpoints"
				label={__('Responsive Breakpoints', 'blockera')}
				disableRegenerateId={false}
				isNativeSupport={true}
				popoverTitle={(itemId, item) => {
					if (getBaseBreakpoint() === itemId) {
						return item.label;
					}

					return __('Breakpoint Settings', 'blockera');
				}}
				valueCleanup={(value) => {
					return Object.fromEntries(
						Object.entries(value).map(([key, item]) => {
							const cleanRepeaterItem = cleanupRepeaterItem(item);

							if (!item.isDefault) {
								return [
									key,
									{
										...cleanRepeaterItem,
										deletable: true,
									},
								];
							}

							return [
								key,
								{
									...cleanRepeaterItem,
									deletable: false,
								},
							];
						})
					);
				}}
				itemIdGenerator={(itemsCount) => {
					return `custom-${itemsCount}`;
				}}
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
				popoverClassName={controlClassNames('breakpoints-edit-popover')}
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
