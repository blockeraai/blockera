/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
/**
 * Publisher dependencies
 */
import { Button, Grid, Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { BaseControl, InputControl } from '../../index';
import { useControlContext } from '../../../context';

export function SidePopover({
	id,
	title = '',
	icon = '',
	unit,
	isOpen,
	offset = 35,
	onClose = () => {},
	onChange = (newValue) => {
		return newValue;
	},
}) {
	const { setValue } = useControlContext({
		id,
		onChange,
		defaultValue: '0px',
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
					<InputControl
						id={id}
						label=""
						type="css"
						unitType="essential"
						range={true}
						min={-250}
						max={250}
						defaultValue="0px"
						onChange={setValue}
					/>

					<BaseControl
						label={__('Shortcuts', 'publisher-core')}
						columns="columns-1"
						className={controlInnerClassNames(
							'side-popover-action-buttons'
						)}
					>
						<Grid gap="10px" gridTemplateColumns="repeat(4, 1fr)">
							<Button
								aria-label={__('Set 0px', 'publisher-core')}
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
								aria-label={__('Set 10px', 'publisher-core')}
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
								aria-label={__('Set 20px', 'publisher-core')}
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
								aria-label={__('Set 30px', 'publisher-core')}
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
								aria-label={__('Set 60px', 'publisher-core')}
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
								aria-label={__('Set 80px', 'publisher-core')}
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
								aria-label={__('Set 100px', 'publisher-core')}
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
								aria-label={__('Set 120px', 'publisher-core')}
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
