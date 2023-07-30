/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button, Grid, Popover } from '@publisher/components';
import { Field } from '@publisher/fields';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { InputControl } from '../../input-control';

export function SidePopover({
	id,
	title = '',
	icon = '',
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

					<Field
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
									setValue('0px');
								}}
							>
								0
							</Button>

							<Button
								aria-label={__('Set 10px', 'publisher-core')}
								size="small"
								onClick={() => setValue('10px')}
							>
								10
							</Button>

							<Button
								aria-label={__('Set 20px', 'publisher-core')}
								size="small"
								onClick={() => setValue('20px')}
							>
								20
							</Button>

							<Button
								aria-label={__('Set 30px', 'publisher-core')}
								size="small"
								onClick={() => setValue('30px')}
							>
								30
							</Button>

							<Button
								aria-label={__('Set 60px', 'publisher-core')}
								size="small"
								onClick={() => {
									setValue('60px');
								}}
							>
								60
							</Button>

							<Button
								aria-label={__('Set 80px', 'publisher-core')}
								size="small"
								onClick={() => setValue('80px')}
							>
								80
							</Button>

							<Button
								aria-label={__('Set 100px', 'publisher-core')}
								size="small"
								onClick={() => setValue('100px')}
							>
								100
							</Button>

							<Button
								aria-label={__('Set 120px', 'publisher-core')}
								size="small"
								onClick={() => setValue('120px')}
							>
								120
							</Button>
						</Grid>
					</Field>
				</Popover>
			)}
		</>
	);
}
