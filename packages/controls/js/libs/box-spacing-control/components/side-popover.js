// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { prepare } from '@blockera/data-editor';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { SidePopoverProps } from '../types';
import {
	Flex,
	Grid,
	Button,
	Popover,
	BaseControl,
	InputControl,
} from '../../index';

export function SidePopover({
	id,
	title = '',
	icon = '',
	isOpen,
	type = 'margin',
	unit,
	offset = 35,
	onClose = () => {},
	onChange,
	defaultValue = '0px',
	inputLabel = __('Space', 'blockera'),
	inputLabelDescription = '',
	inputLabelPopoverTitle = '',
}: SidePopoverProps): MixedElement {
	const [unitType, setUnitType] = useState('px');

	useEffect(() => {
		if (unit) {
			setUnitType(unit);
		}
	}, [unit]);

	function getAllActionButtons() {
		return (
			<Grid
				gridTemplateColumns="repeat(4, 1fr)"
				gap="8px"
				style={{ width: '100%' }}
			>
				<Button
					size="small"
					aria-label="Set 0px"
					onClick={() => {
						if (unitType === 'auto' || unitType === 'func') {
							onChange('0px');
						} else {
							onChange('0' + unitType);
						}
					}}
					style={{
						padding: '2px 0',
					}}
					data-cy="box-spacing-set-0"
				>
					0
				</Button>

				<Button
					size="small"
					aria-label="Set 10px"
					onClick={() => {
						if (unitType === 'auto' || unitType === 'func') {
							onChange('10px');
						} else {
							onChange('10' + unitType);
						}
					}}
					style={{
						padding: '2px 0',
					}}
					data-cy="box-spacing-set-10"
				>
					10
				</Button>

				<Button
					size="small"
					aria-label="Set 20px"
					onClick={() => {
						if (unitType === 'auto' || unitType === 'func') {
							onChange('20px');
						} else {
							onChange('20' + unitType);
						}
					}}
					style={{
						padding: '2px 0',
					}}
					data-cy="box-spacing-set-20"
				>
					20
				</Button>

				<Button
					size="small"
					aria-label="Set 30px"
					onClick={() => {
						if (unitType === 'auto' || unitType === 'func') {
							onChange('30px');
						} else {
							onChange('30' + unitType);
						}
					}}
					style={{
						padding: '2px 0',
					}}
					data-cy="box-spacing-set-30"
				>
					30
				</Button>

				<Button
					size="small"
					aria-label="Set 60px"
					onClick={() => {
						if (unitType === 'auto' || unitType === 'func') {
							onChange('60px');
						} else {
							onChange('60' + unitType);
						}
					}}
					style={{
						padding: '2px 0',
					}}
					data-cy="box-spacing-set-60"
				>
					60
				</Button>

				<Button
					size="small"
					aria-label="Set 80px"
					onClick={() => {
						if (unitType === 'auto' || unitType === 'func') {
							onChange('80px');
						} else {
							onChange('80' + unitType);
						}
					}}
					style={{
						padding: '2px 0',
					}}
					data-cy="box-spacing-set-80"
				>
					80
				</Button>

				<Button
					size="small"
					aria-label="Set 100px"
					onClick={() => {
						if (unitType === 'auto' || unitType === 'func') {
							onChange('100px');
						} else {
							onChange('100' + unitType);
						}
					}}
					style={{
						padding: '2px 0',
					}}
					data-cy="box-spacing-set-100"
				>
					100
				</Button>

				<Button
					size="small"
					aria-label="Set 120px"
					onClick={() => {
						if (unitType === 'auto' || unitType === 'func') {
							onChange('120px');
						} else {
							onChange('120' + unitType);
						}
					}}
					style={{
						padding: '2px 0',
					}}
					data-cy="box-spacing-set-120"
				>
					120
				</Button>
			</Grid>
		);
	}

	return (
		<>
			{isOpen && (
				<Popover
					title={
						<>
							{icon} <span>{title}</span>
						</>
					}
					offset={offset}
					placement="left-start"
					className="spacing-edit-popover"
					onClose={onClose}
				>
					<InputControl
						columns="1fr 1fr"
						label={inputLabel}
						labelPopoverTitle={inputLabelPopoverTitle}
						labelDescription={inputLabelDescription}
						id={id}
						unitType={type}
						range={false}
						min={type === 'margin' ? undefined : 0}
						//
						defaultValue={prepare(id, defaultValue)}
						onChange={onChange}
						controlAddonTypes={['variable']}
						variableTypes={['spacing']}
					/>

					<BaseControl
						label={
							<Flex gap="4px" alignItems="center">
								<Icon icon="shortcut" iconSize="20" />
								{__('Shortcuts', 'blockera')}
							</Flex>
						}
						columns="columns-1"
						className={controlInnerClassNames(
							'side-popover-action-buttons'
						)}
						mode={'simple'}
					>
						<>
							{type === 'margin' && (
								<Flex direction="row">
									<Flex
										direction="column"
										style={{ width: '40%' }}
									>
										<Button
											size="small"
											aria-label="Set Auto"
											className="auto-btn"
											onClick={() => {
												onChange('auto');
											}}
											data-cy="box-spacing-set-auto"
										>
											{__('Auto', 'blockera')}
										</Button>
									</Flex>
									{getAllActionButtons()}
								</Flex>
							)}

							{type === 'padding' && <>{getAllActionButtons()}</>}
						</>
					</BaseControl>
				</Popover>
			)}
		</>
	);
}
