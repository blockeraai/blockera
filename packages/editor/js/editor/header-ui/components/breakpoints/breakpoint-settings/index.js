// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { useMemo, memo, useCallback, useRef } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { mergeObject, isEquals } from '@blockera/utils';
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
	CompanionPluginModal,
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

const filteredDefaultRepeaterItemValue = applyFilters(
	'blockera.breakpoints.defaultRepeaterItemValue',
	defaultRepeaterItemValue
);

const newBreakpointRepeaterItemDefaults = {
	...filteredDefaultRepeaterItemValue,
	deletable: true,
	native: false,
	isDefault: false,
	status: true,
};

const isBreakpointDeletable = (item: Object, breakpointId: string): boolean => {
	if (item?.isDefault || breakpointId === getBaseBreakpoint()) {
		return false;
	}

	return true;
};

const BreakpointsSettings: ComponentType<BreakpointSettingsComponentProps> =
	memo(
		({
			onChange,
			breakpoints,
			defaultValue,
		}: BreakpointSettingsComponentProps): MixedElement => {
			const customBreakpointIdRef = useRef(
				Object.keys(breakpoints).reduce((maxId, key) => {
					const match = /^custom-(\d+)$/.exec(key);

					if (!match) {
						return maxId;
					}

					return Math.max(maxId, parseInt(match[1], 10));
				}, 0)
			);
			const stableContextRef = useRef(null);

			const stableMergedRef = useRef(null);

			const mergedBreakpoints = useMemo(() => {
				const next = Object.fromEntries(
					Object.entries(breakpoints).map(([key, value]) => [
						key,
						mergeObject(defaultRepeaterItemValue, {
							...value,
							// $FlowFixMe
							native: value?.native || false,
							deletable: isBreakpointDeletable(value, key),
						}),
					])
				);
				const previous = stableMergedRef.current;

				if (previous && isEquals(previous, next)) {
					return previous;
				}

				stableMergedRef.current = next;

				return next;
			}, [breakpoints]);

			const controlContextValue = useMemo(() => {
				const nextValue = applyFilters(
					'blockera.breakpoints.value',
					mergedBreakpoints
				);
				const previous = stableContextRef.current;

				if (previous && isEquals(previous.value, nextValue)) {
					return previous;
				}

				const next = {
					name: 'canvas-editor-breakpoints',
					value: nextValue,
					// Keep the repeater store as the editing source of truth.
					// Parent onChange echoes would otherwise re-sync and remount rows.
					skipSyncValue: true,
				};

				stableContextRef.current = next;

				return next;
			}, [mergedBreakpoints]);

			const valueCleanup = useCallback((value) => {
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
			}, []);

			const itemIdGenerator = useCallback((): string => {
				customBreakpointIdRef.current += 1;

				return `custom-${customBreakpointIdRef.current}`;
			}, []);

			const popoverTitle = useCallback((itemId, item) => {
				if (getBaseBreakpoint() === itemId) {
					return item.label;
				}

				return __('Breakpoint Settings', 'blockera');
			}, []);

			return (
				<ControlContextProvider
					value={controlContextValue}
					storeName={REPEATER_STORE_NAME}
				>
					<BaseControl
						columns="columns-2"
						label={__('Responsive Breakpoints', 'blockera')}
					>
						<RepeaterControl
							id="breakpoints"
							mode={'accordion'}
							// Prop name is inverted in repeater reducers: false keeps stable
							// slug keys (desktop, tablet, custom-N) when deleting rows.
							disableRegenerateId={false}
							popoverTitle={popoverTitle}
							valueCleanup={valueCleanup}
							itemIdGenerator={itemIdGenerator}
							className={controlInnerClassNames(
								'breakpoints-repeater'
							)}
							defaultRepeaterItemValue={
								newBreakpointRepeaterItemDefaults
							}
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
								// Theme-only: install companion. Companion plugin: upgrade to Pro.
								// Return an empty fragment when closed so isEnabledPromote still
								// detects this PromoComponent (null would disable the gate).
								if (
									!applyFilters(
										'blockera.products.isCompanionPlugin',
										false
									)
								) {
									if (!isOpen) {
										return <></>;
									}

									return (
										<CompanionPluginModal
											isOpen={isOpen}
											onRequestClose={onClose}
										/>
									);
								}

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
