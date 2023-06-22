/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Button, Grid, Popover } from '@publisher/components';
import { Field, InputField } from '@publisher/fields';
import { controlInnerClassNames } from '@publisher/classnames';

export function SidePopover({
	label = '',
	icon = '',
	isOpen,
	value,
	offset = 35,
	onClose = () => {},
	onValueChange = (newValue) => {
		return newValue;
	},
}) {
	const [controlValue, setControlValue] = useState(value);

	return (
		<>
			{isOpen && (
				<Popover
					label={
						<>
							{icon} <span>{label}</span>
						</>
					}
					offset={offset}
					placement="left-start"
					className="spacing-edit-popover"
					onClose={onClose}
				>
					<InputField
						label=""
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -250,
							max: 250,
							initValue: '0px',
						}}
						//
						initValue="0px"
						value={controlValue !== '' ? controlValue : '0px'}
						onValueChange={(newValue) => {
							setControlValue(value);
							onValueChange(newValue);
						}}
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
								size="small"
								onClick={() => {
									setControlValue('0px');
								}}
							>
								0
							</Button>

							<Button
								size="small"
								onClick={() => setControlValue('10px')}
							>
								10
							</Button>

							<Button
								size="small"
								onClick={() => setControlValue('20px')}
							>
								20
							</Button>

							<Button
								size="small"
								onClick={() => setControlValue('30px')}
							>
								30
							</Button>

							<Button
								size="small"
								onClick={() => {
									setControlValue('60px');
								}}
							>
								60
							</Button>

							<Button
								size="small"
								onClick={() => setControlValue('80px')}
							>
								80
							</Button>

							<Button
								size="small"
								onClick={() => setControlValue('100px')}
							>
								100
							</Button>

							<Button
								size="small"
								onClick={() => setControlValue('120px')}
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
