/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

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
	unit = 'px',
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
									setValue('0' + unit);
								}}
							>
								0
							</Button>

							<Button
								aria-label={__('Set 10px', 'publisher-core')}
								size="small"
								onClick={() => setValue('10' + unit)}
							>
								10
							</Button>

							<Button
								aria-label={__('Set 20px', 'publisher-core')}
								size="small"
								onClick={() => setValue('20' + unit)}
							>
								20
							</Button>

							<Button
								aria-label={__('Set 30px', 'publisher-core')}
								size="small"
								onClick={() => setValue('30' + unit)}
							>
								30
							</Button>

							<Button
								aria-label={__('Set 60px', 'publisher-core')}
								size="small"
								onClick={() => {
									setValue('60' + unit);
								}}
							>
								60
							</Button>

							<Button
								aria-label={__('Set 80px', 'publisher-core')}
								size="small"
								onClick={() => setValue('80' + unit)}
							>
								80
							</Button>

							<Button
								aria-label={__('Set 100px', 'publisher-core')}
								size="small"
								onClick={() => setValue('100' + unit)}
							>
								100
							</Button>

							<Button
								aria-label={__('Set 120px', 'publisher-core')}
								size="small"
								onClick={() => setValue('120' + unit)}
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
