/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Button, Flex, Grid, Popover } from '@publisher/components';
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
			<Grid
				gridTemplateColumns="repeat(4, 1fr)"
				gap="8px"
				style={{ width: '100%' }}
			>
				<Button
					size="small"
					onClick={() => {
						setControlValue('0px');
					}}
					style={{
						padding: '2px 0',
					}}
				>
					0
				</Button>

				<Button
					size="small"
					onClick={() => setControlValue('10px')}
					style={{
						padding: '2px 0',
					}}
				>
					10
				</Button>

				<Button
					size="small"
					onClick={() => setControlValue('20px')}
					style={{
						padding: '2px 0',
					}}
				>
					20
				</Button>

				<Button
					size="small"
					onClick={() => setControlValue('30px')}
					style={{
						padding: '2px 0',
					}}
				>
					30
				</Button>

				<Button
					size="small"
					onClick={() => {
						setControlValue('60px');
					}}
					style={{
						padding: '2px 0',
					}}
				>
					60
				</Button>

				<Button
					size="small"
					onClick={() => setControlValue('80px')}
					style={{
						padding: '2px 0',
					}}
				>
					80
				</Button>

				<Button
					size="small"
					onClick={() => setControlValue('100px')}
					style={{
						padding: '2px 0',
					}}
				>
					100
				</Button>

				<Button
					size="small"
					onClick={() => setControlValue('120px')}
					style={{
						padding: '2px 0',
					}}
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
							defaultValue: '0px',
						}}
						//
						defaultValue="0px"
						value={controlValue !== '' ? controlValue : '0px'}
						onChange={(newValue) => {
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
								<Flex direction="row">
									<Flex
										direction="column"
										style={{ width: '40%' }}
									>
										<Button
											size="small"
											className="auto-btn"
											onClick={() => {
												setControlValue('0Auto');
											}}
										>
											{__('Auto', 'publisher-core')}
										</Button>
									</Flex>
									{getAllActionButtons()}
								</Flex>
							)}

							{type === 'padding' && <>{getAllActionButtons()}</>}
						</>
					</Field>
				</Popover>
			)}
		</>
	);
}
