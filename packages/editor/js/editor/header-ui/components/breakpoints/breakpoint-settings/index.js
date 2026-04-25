// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { useMemo, memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import {
	controlInnerClassNames,
	controlClassNames,
} from '@blockera/classnames';
import {
	Flex,
	BaseControl,
	UpgradePrompt,
	RepeaterControl,
	cleanupRepeaterItem,
	ControlContextProvider,
} from '@blockera/controls';
import { defaultItemValue } from '@blockera/controls/js/libs/repeater-control/default-item-value';
import { STORE_NAME as REPEATER_STORE_NAME } from '@blockera/controls/js/libs/repeater-control/store/constants';
import { Icon } from '@blockera/icons';

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
		iconType: 'library',
		picked: false,
	},
	native: true,
	type: '',
	force: false,
	label: '',
	attributes: {},
};

const BreakpointsSettings: ComponentType<BreakpointSettingsComponentProps> =
	memo(
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
							// $FlowFixMe
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
						value: applyFilters(
							'blockera.breakpoints.value',
							breakpoints
						),
					}}
					storeName={REPEATER_STORE_NAME}
				>
					<BaseControl
						columns="columns-2"
						label={__('Responsive Breakpoints', 'blockera')}
					>
						<RepeaterControl
							id="breakpoints"
							mode={'accordion'}
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
							className={controlInnerClassNames(
								'breakpoints-repeater'
							)}
							defaultRepeaterItemValue={applyFilters(
								'blockera.breakpoints.defaultRepeaterItemValue',
								defaultRepeaterItemValue
							)}
							repeaterItemHeader={Header}
							repeaterItemChildren={Fields}
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
									<UpgradePrompt
										lockedFeature={{
											icon: (
												<Icon
													icon="responsive-breakpoints"
													iconSize={22}
												/>
											),
											title: __(
												'Advanced & Custom Breakpoints',
												'blockera'
											),
											description: (
												<Flex
													direction="column"
													gap="6px"
												>
													{__(
														'Get 7 breakpoints and customize any of them or add your own',
														'blockera'
													)}
													<Flex
														direction="column"
														gap="6px"
													>
														<span className="blockera-free-plan-hint">
															{__(
																'Free: 3 breakpoints',
																'blockera'
															)}
														</span>
														<span className="blockera-pro-plan-hint">
															{__(
																'Pro: 7 breakpoints + custom breakpoints',
																'blockera'
															)}
														</span>
													</Flex>
												</Flex>
											),
										}}
										isOpen={isOpen}
										onClose={onClose}
										type="modal"
									/>
								);
							}}
							defaultValue={defaultValue}
						/>
					</BaseControl>
				</ControlContextProvider>
			);
		}
	);

export default BreakpointsSettings;
