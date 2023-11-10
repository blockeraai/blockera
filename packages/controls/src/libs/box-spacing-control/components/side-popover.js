/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { Button, Flex, Grid, Popover } from '@publisher/components';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { BaseControl, InputControl } from '../../index';

export function SidePopover({
	id,
	title = '',
	icon = '',
	isOpen,
	type = 'margin',
	unit,
	offset = 35,
	onClose = () => {},
	onChange = (newValue) => {
		return newValue;
	},
	defaultValue = '0px',
}) {
	const { setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
	});

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
						setValue('0' + unitType);
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
						setValue('10' + unitType);
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
						setValue('20' + unitType);
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
						setValue('30' + unitType);
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
						setValue('60' + unitType);
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
						setValue('80' + unitType);
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
						setValue('100' + unitType);
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
						setValue('120' + unitType);
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
					<BaseControl controlName="input">
						<InputControl
							id={id}
							unitType={type}
							range={true}
							min={type === 'margin' ? -100 : 0}
							max={100}
							//
							defaultValue={defaultValue}
							onChange={setValue}
						/>
					</BaseControl>

					<BaseControl
						label={__('Shortcuts', 'publisher-core')}
						columns="columns-1"
						className={controlInnerClassNames(
							'side-popover-action-buttons'
						)}
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
												setValue('0auto');
											}}
											data-cy="box-spacing-set-auto"
										>
											{__('Auto', 'publisher-core')}
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
