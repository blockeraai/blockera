// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
import { useMemo, memo } from '@wordpress/element';

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

const BreakpointsSettings = memo(
	({
		onChange,
		breakpoints,
		defaultValue,
	}: BreakpointSettingsComponentProps): MixedElement => {
		breakpoints = useMemo(() => {
			return Object.fromEntries(
				Object.entries(breakpoints).map(([key, value]) => [
					key,
					mergeObject(defaultRepeaterItemValue, {
						...value,
						native: value?.native || false,
					}),
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
					mode={'accordion'}
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
								const cleanRepeaterItem =
									cleanupRepeaterItem(item);

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
						<Header {...{ ...props, breakpoints }} />
					)}
					repeaterItemChildren={(props) => (
						<Fields {...{ ...props, breakpoints }} />
					)}
					onChange={onChange}
					addNewButtonDataTest={'add-new-breakpoint'}
					popoverClassName={controlClassNames(
						'breakpoints-edit-popover'
					)}
					PromoComponent={({
						onClose = () => {},
						isOpen = false,
					}): MixedElement | null => {
						return (
							<PromotionPopover
								heading={__('Advanced Breakpoints', 'blockera')}
								featuresList={[
									__('7 responsive breakpoints', 'blockera'),
									__('Edit breakpoint settings', 'blockera'),
									__('New custom breakpoints', 'blockera'),
									__(
										'Design for any screen size',
										'blockera'
									),
								]}
								isOpen={isOpen}
								onClose={onClose}
							/>
						);
					}}
					defaultValue={defaultValue}
				/>
			</ControlContextProvider>
		);
	},
	() => {
		return true;
	}
);

export default BreakpointsSettings;
