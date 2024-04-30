/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Button, Flex, Grid, Popover } from '@blockera/components';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { BaseControl, InputControl } from '../../index';
import { useControlContext } from '../../../context';
import ShortcutIcon from '../icons/shortcut';

export function SidePopover({
	id,
	getId,
	property,
	sideId,
	sideLabel,
	title = '',
	icon = '',
	unit,
	isOpen,
	offset = 35,
	onClose = () => {},
	onChange = (newValue) => {
		return newValue;
	},
	defaultValue = '',
}) {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id: property,
		onChange,
		defaultValue,
	});

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
				>
					<BaseControl
						controlName="input"
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
						style={{ marginBottom: '25px' }}
						{...{
							value,
							attribute,
							blockName,
							defaultValue,
							resetToDefault,
							singularId: sideId,
							path: getControlPath(attribute, property),
							mode: 'advanced',
						}}
					>
						<InputControl
							id={getId(id, property)}
							unitType="essential"
							range={true}
							min={-250}
							max={250}
							//
							defaultValue={defaultValue}
							onChange={setValue}
							controlAddonTypes={['variable']}
							variableTypes={['spacing']}
						/>
					</BaseControl>

					<BaseControl
						label={
							<Flex gap="4px" alignItems="center">
								<ShortcutIcon />
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
										setValue('0px');
									} else {
										setValue('0' + unitType);
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
										setValue('10px');
									} else {
										setValue('10' + unitType);
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
										setValue('20px');
									} else {
										setValue('20' + unitType);
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
										setValue('30px');
									} else {
										setValue('30' + unitType);
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
										setValue('60px');
									} else {
										setValue('60' + unitType);
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
										setValue('80px');
									} else {
										setValue('80' + unitType);
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
										setValue('100px');
									} else {
										setValue('100' + unitType);
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
										setValue('120px');
									} else {
										setValue('120' + unitType);
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
