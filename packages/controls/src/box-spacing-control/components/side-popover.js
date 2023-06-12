/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Button, HStack, Popover, VStack } from '@publisher/components';
import { Field, InputField } from '@publisher/fields';
import { controlInnerClassNames } from '@publisher/classnames';

export function SidePopover({
	label = '',
	icon = '',
	isOpen,
	type = 'margin',
	value,
	offset = 35,
	onClose = () => {},
	onValueChange = (newValue) => {
		return newValue;
	},
}) {
	const [controlValue, setControlValue] = useState(value);

	function getAllActionButtons() {
		return (
			<VStack>
				<HStack>
					<Button
						size="small"
						align="center"
						onClick={() => {
							setControlValue('0px');
						}}
					>
						0
					</Button>

					<Button
						size="small"
						align="center"
						onClick={() => setControlValue('10px')}
					>
						10
					</Button>

					<Button
						size="small"
						align="center"
						onClick={() => setControlValue('20px')}
					>
						20
					</Button>

					<Button
						size="small"
						align="center"
						onClick={() => setControlValue('30px')}
					>
						30
					</Button>
				</HStack>
				<HStack>
					<Button
						size="small"
						align="center"
						onClick={() => {
							setControlValue('60px');
						}}
					>
						60
					</Button>

					<Button
						size="small"
						align="center"
						onClick={() => setControlValue('80px')}
					>
						80
					</Button>

					<Button
						size="small"
						align="center"
						onClick={() => setControlValue('100px')}
					>
						100
					</Button>

					<Button
						size="small"
						align="center"
						onClick={() => setControlValue('120px')}
					>
						120
					</Button>
				</HStack>
			</VStack>
		);
	}

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
							min: type === 'margin' ? -100 : 0,
							max: 100,
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
						<>
							{type === 'margin' && (
								<HStack>
									<HStack style={{ width: '68px' }}>
										<Button
											size="small"
											align="center"
											className="auto-btn"
											onClick={() => {
												setControlValue('0Auto');
											}}
										>
											Auto
										</Button>
									</HStack>
									{getAllActionButtons()}
								</HStack>
							)}

							{type === 'padding' && <>{getAllActionButtons()}</>}
						</>
					</Field>
				</Popover>
			)}
		</>
	);
}
