// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	IconControl,
	BaseControl,
	InputControl,
	ToggleControl,
	RepeaterContext,
	useControlContext,
} from '@blockera/controls';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from '../helpers';
import { BreakpointIcon } from '../breakpoint-icon';

export default function ({
	item,
	itemId,
}: {
	item: Object,
	itemId: number,
}): MixedElement {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const { onChange, repeaterId, valueCleanup } = useContext(RepeaterContext);

	return (
		<>
			{itemId === getBaseBreakpoint() && (
				<div className="base-breakpoint-content">
					<h3>
						<Flex gap="10" alignItems="center">
							<BreakpointIcon
								name={item.type}
								settings={item.settings}
							/>
							{__('Base Breakpoint', 'blockera')}
						</Flex>
					</h3>
					<p>
						{__(
							'This is your base breakpoint that defines the default styling for all screen sizes.',
							'blockera'
						)}
					</p>
				</div>
			)}
			<InputControl
				id={'name'}
				type={'text'}
				columns={'columns-2'}
				defaultValue={item.label}
				onChange={(newValue, ref) =>
					changeRepeaterItem({
						ref,
						itemId,
						onChange,
						controlId,
						repeaterId,
						valueCleanup,
						value: {
							...item,
							label: newValue,
						},
					})
				}
				label={__('Name', 'blockera')}
			/>
			{itemId !== getBaseBreakpoint() && (
				<BaseControl columns="columns-1" label={__('Size', 'blockera')}>
					<Flex
						style={{
							width: '173px',
							alignSelf: 'flex-end',
							alignItems: 'center',
						}}
					>
						<InputControl
							id={'settings.min'}
							type={'number'}
							unitType={'width'}
							columns={'columns-2'}
							defaultValue={item.settings.min}
							onChange={(newValue, ref) =>
								changeRepeaterItem({
									ref,
									itemId,
									onChange,
									controlId,
									repeaterId,
									valueCleanup,
									value: {
										...item,
										settings: {
											...item.settings,
											min: newValue,
										},
									},
								})
							}
							placeholder="0"
							size="small"
							className={controlClassNames(
								'control-first label-center small-gap'
							)}
							label={__('Min', 'blockera')}
							aria-label={__('Min Width', 'blockera')}
						/>
						<InputControl
							id={'settings.max'}
							type={'number'}
							unitType={'width'}
							columns={'columns-2'}
							defaultValue={item.settings.max}
							onChange={(newValue, ref) =>
								changeRepeaterItem({
									ref,
									itemId,
									onChange,
									controlId,
									repeaterId,
									valueCleanup,
									value: {
										...item,
										settings: {
											...item.settings,
											max: newValue,
										},
									},
								})
							}
							placeholder="0"
							size="small"
							className={controlClassNames(
								'control-first label-center small-gap'
							)}
							label={__('Max', 'blockera')}
							aria-label={__('Max Width', 'blockera')}
						/>
					</Flex>
				</BaseControl>
			)}

			<BaseControl columns="columns-2" label={__('Icon', 'blockera')}>
				<IconControl
					id={'settings.icon'}
					columns={'columns-1'}
					defaultValue={item.settings.icon}
					onChange={(newValue, ref) =>
						changeRepeaterItem({
							ref,
							itemId,
							onChange,
							controlId,
							repeaterId,
							valueCleanup,
							value: {
								...item,
								settings: {
									...item.settings,
									icon: newValue,
								},
							},
						})
					}
				/>
			</BaseControl>

			{itemId !== getBaseBreakpoint() && (
				<BaseControl
					style={{
						alignItems: 'center',
					}}
					columns="columns-2"
					label={__('Status', 'blockera')}
				>
					<ToggleControl
						labelType={'self'}
						id={'status'}
						defaultValue={item.settings.picked}
						onChange={(picked: boolean, ref: any): void => {
							changeRepeaterItem({
								ref,
								itemId,
								onChange,
								controlId,
								repeaterId,
								valueCleanup,
								value: {
									...item,
									status: picked,
									settings: {
										...item.settings,
										picked,
									},
								},
							});
						}}
					/>
				</BaseControl>
			)}
		</>
	);
}
