/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
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
	getId,
	sideId,
	sideLabel,
	hasValue,
	removeValue,
	title = '',
	icon = '',
	unit,
	isOpen,
	offset = 35,
	onClose = () => {},
	defaultValue,
	setValue,
	value,
}) {
	const [unitType, setUnitType] = useState('px');

	useEffect(() => {
		if (unit) {
			setUnitType(unit);
		}
	}, [unit]);

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
					titleButtonsRight={
						<>
							<Button
								tabIndex="-1"
								size={'extra-small'}
								onClick={() => {
									if (hasValue) {
										removeValue();
										onClose();
									}
								}}
								style={{ padding: '5px' }}
								aria-label={__('Remove value', 'blockera')}
								disabled={!hasValue}
							>
								<Icon icon="trash" size="20" />
							</Button>
						</>
					}
				>
					<InputControl
						label={sideLabel}
						labelPopoverTitle={sprintf(
							// Translators: %s is the position name (top, right, bottom, left)
							__('%s Position', 'blockera'),
							sideLabel
						)}
						labelDescription={
							<>
								{sprintf(
									// Translators: %1$s and %2$s both are edge in the position (top, right, left, bottom)
									__(
										'It sets the distance from the %1$s edge of the block to the %1$s edge of its nearest positioned ancestor or containing block.',
										'blockera'
									),
									sideId,
									sideId
								)}
							</>
						}
						columns={'columns-2'}
						id={getId(id, 'position.' + sideId)}
						unitType="essential"
						range={true}
						min={-250}
						max={250}
						//
						defaultValue={defaultValue.position[sideId]}
						onChange={(newValue, ref) =>
							setValue(
								{
									...value,
									position: {
										...value.position,
										[sideId]: newValue,
									},
								},
								ref
							)
						}
						controlAddonTypes={['variable']}
						variableTypes={['spacing']}
					/>

					<BaseControl
						label={
							<Flex gap="4px" alignItems="center">
								<Icon icon="shortcut" />
								{__('Shortcuts', 'blockera')}
							</Flex>
						}
						columns="columns-1"
						className={controlInnerClassNames(
							'side-popover-action-buttons'
						)}
					>
						<Grid gap="10px" gridTemplateColumns="repeat(4, 1fr)">
							<Button
								aria-label={__('Set 0px', 'blockera')}
								size="small"
								onClick={() => {
									if (unitType === 'func') {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '0px',
											},
										});
									} else {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '0' + unitType,
											},
										});
									}
								}}
								data-cy="set-0"
							>
								0
							</Button>

							<Button
								aria-label={__('Set 10px', 'blockera')}
								size="small"
								onClick={() => {
									if (unitType === 'func') {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '10px',
											},
										});
									} else {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '10' + unitType,
											},
										});
									}
								}}
								data-cy="set-10"
							>
								10
							</Button>

							<Button
								aria-label={__('Set 20px', 'blockera')}
								size="small"
								onClick={() => {
									if (unitType === 'func') {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '20px',
											},
										});
									} else {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '20' + unitType,
											},
										});
									}
								}}
								data-cy="set-20"
							>
								20
							</Button>

							<Button
								aria-label={__('Set 30px', 'blockera')}
								size="small"
								onClick={() => {
									if (unitType === 'func') {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '30px',
											},
										});
									} else {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '30' + unitType,
											},
										});
									}
								}}
								data-cy="set-30"
							>
								30
							</Button>

							<Button
								aria-label={__('Set 60px', 'blockera')}
								size="small"
								onClick={() => {
									if (unitType === 'func') {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '60px',
											},
										});
									} else {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '60' + unitType,
											},
										});
									}
								}}
								data-cy="set-60"
							>
								60
							</Button>

							<Button
								aria-label={__('Set 80px', 'blockera')}
								size="small"
								onClick={() => {
									if (unitType === 'func') {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '80px',
											},
										});
									} else {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '80' + unitType,
											},
										});
									}
								}}
								data-cy="set-80"
							>
								80
							</Button>

							<Button
								aria-label={__('Set 100px', 'blockera')}
								size="small"
								onClick={() => {
									if (unitType === 'func') {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '100px',
											},
										});
									} else {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '100' + unitType,
											},
										});
									}
								}}
								data-cy="set-100"
							>
								100
							</Button>

							<Button
								aria-label={__('Set 120px', 'blockera')}
								size="small"
								onClick={() => {
									if (unitType === 'func') {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '120px',
											},
										});
									} else {
										setValue({
											...value,
											position: {
												...value.position,
												[sideId]: '120' + unitType,
											},
										});
									}
								}}
								data-cy="set-120"
							>
								120
							</Button>
						</Grid>
					</BaseControl>
				</Popover>
			)}
		</>
	);
}
