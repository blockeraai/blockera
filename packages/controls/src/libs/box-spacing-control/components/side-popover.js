/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button, Flex, Grid, Popover } from '@publisher/components';
import { Field, InputField } from '@publisher/fields';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';

export function SidePopover({
	id,
	title = '',
	icon = '',
	isOpen,
	type = 'margin',
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
						setValue('0px');
					}}
					style={{
						padding: '2px 0',
					}}
				>
					0
				</Button>

				<Button
					size="small"
					aria-label="Set 10px"
					onClick={() => setValue('10px')}
					style={{
						padding: '2px 0',
					}}
				>
					10
				</Button>

				<Button
					size="small"
					aria-label="Set 20px"
					onClick={() => setValue('20px')}
					style={{
						padding: '2px 0',
					}}
				>
					20
				</Button>

				<Button
					size="small"
					aria-label="Set 30px"
					onClick={() => setValue('30px')}
					style={{
						padding: '2px 0',
					}}
				>
					30
				</Button>

				<Button
					size="small"
					aria-label="Set 60px"
					onClick={() => {
						setValue('60px');
					}}
					style={{
						padding: '2px 0',
					}}
				>
					60
				</Button>

				<Button
					size="small"
					aria-label="Set 80px"
					onClick={() => setValue('80px')}
					style={{
						padding: '2px 0',
					}}
				>
					80
				</Button>

				<Button
					size="small"
					aria-label="Set 100px"
					onClick={() => setValue('100px')}
					style={{
						padding: '2px 0',
					}}
				>
					100
				</Button>

				<Button
					size="small"
					aria-label="Set 120px"
					onClick={() => setValue('120px')}
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
					<InputField
						id={id}
						label=""
						settings={{
							type: 'css',
							unitType: type,
							range: true,
							min: type === 'margin' ? -100 : 0,
							max: 100,
							defaultValue: '0px',
						}}
						//
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
