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
	Grid,
	IconControl,
	BaseControl,
	InputControl,
	SelectControl,
	ToggleControl,
	RepeaterContext,
	useControlContext,
	NoticeControl,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { iconsOptions } from './icons';
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
				<Flex
					direction="column"
					gap="5px"
					className="base-breakpoint-content"
					style={{
						marginBottom: '15px',
					}}
				>
					<h4 style={{ margin: '0' }}>
						<Flex gap="10" alignItems="center">
							<BreakpointIcon
								name={item.type}
								settings={item.settings}
							/>
							{__('Base Breakpoint', 'blockera')}
						</Flex>
					</h4>
					<p style={{ margin: '0' }}>
						{__(
							'This is your base breakpoint that defines the default styling for all screen sizes.',
							'blockera'
						)}
					</p>
				</Flex>
			)}

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
			>
				<p
					style={{
						color: 'rgb(148 148 148)',
						margin: '8px 0 0',
						fontSize: '12px',
					}}
				>
					{__('ID: ', 'blockera')}

					<i
						style={{
							backgroundColor: '#f0f0f0',
							padding: '2px 5px',
							borderRadius: '2px',
							color: 'rgb(134 134 134)',
						}}
					>
						{itemId}
					</i>
				</p>
			</InputControl>

			{itemId !== getBaseBreakpoint() && (
				<BaseControl columns="columns-2" label={__('Size', 'blockera')}>
					<Grid alignItems="center" gridTemplateColumns="1fr 1fr">
						<InputControl
							id={'settings.min'}
							type={'number'}
							unitType={'media-query'}
							columns={'columns-1'}
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
							placeholder=""
							size="small"
							className="control-first label-center small-gap"
							label={__('Min Width', 'blockera')}
							aria-label={__('Min Width', 'blockera')}
						/>

						<InputControl
							id={'settings.max'}
							type={'number'}
							unitType={'media-query'}
							columns={'columns-1'}
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
							placeholder=""
							size="small"
							className="control-first label-center small-gap"
							label={__('Max Width', 'blockera')}
							aria-label={__('Max Width', 'blockera')}
						/>
					</Grid>
				</BaseControl>
			)}

			<BaseControl columns="columns-2" label={__('Icon', 'blockera')}>
				<SelectControl
					id={`settings.icon`}
					defaultValue={(() => {
						if (item.settings.iconType === 'library') {
							return item.settings.icon.icon;
						}

						if (item.settings.iconType === 'custom') {
							return 'custom';
						}

						return '';
					})()}
					options={iconsOptions}
					type="custom"
					aria-label={__('Choose an icon', 'blockera')}
					onChange={(newValue, ref) => {
						if ('custom' === newValue) {
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
										icon: {
											icon: '',
											library: '',
											uploadSVG: '',
										},
										iconType: 'custom',
									},
								},
							});
							return;
						}

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
									iconType: 'library',
									icon: {
										icon: newValue,
										library: 'ui',
										uploadSVG: '',
									},
								},
							},
						});
					}}
				/>

				{item.settings.iconType === 'custom' && (
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
				)}
			</BaseControl>

			{item.settings.max && !item.settings.min && (
				<BaseControl columns="columns-1" label="">
					<NoticeControl type="information">
						{__(
							'Smaller screen sizes inherit style from this breakpoint.',
							'blockera'
						)}
					</NoticeControl>
				</BaseControl>
			)}

			{item.settings.min && !item.settings.max && (
				<BaseControl columns="columns-1" label="">
					<NoticeControl type="information">
						{__(
							'Larger screen sizes inherit style from this breakpoint.',
							'blockera'
						)}
					</NoticeControl>
				</BaseControl>
			)}

			{item.settings.min && item.settings.max && (
				<BaseControl columns="columns-1" label="">
					<NoticeControl type="information">
						{__(
							'Screen sizes between min and max width inherit style from this breakpoint.',
							'blockera'
						)}
					</NoticeControl>
				</BaseControl>
			)}

			{!item.settings.min && !item.settings.max && (
				<BaseControl columns="columns-1" label="">
					<NoticeControl type="error">
						{__(
							'Please set min or max width for this breakpoint.',
							'blockera'
						)}
					</NoticeControl>
				</BaseControl>
			)}
		</>
	);
}
