/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	AlignmentMatrixControl,
	convertAlignmentMatrixCoordinates,
	useControlContext,
} from '@publisher/controls';
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { Field, InputField } from '../../index';

// todo remove this filed, it's replaced by AlignmentMatrixControl
export function PositionField({
	label = __('Position', 'publisher-core'),
	className,
	//
	topValue,
	leftValue,
	children,
	//
	onChange = () => {},
}) {
	const { value: coordinates, setValue: setCoordinates } = useControlContext({
		defaultValue: {
			top: topValue,
			left: leftValue,
		},
	});

	return (
		<Field label={label} field="position" className={className}>
			<Flex gap="8px" direction="row" justify="space-around">
				<div style={{ width: '75%' }}>
					<AlignmentMatrixControl
						id={'coordinates'}
						onChange={(newValue) => {
							const _coordinates =
								convertAlignmentMatrixCoordinates(newValue);

							setCoordinates({
								coordinates: _coordinates,
								top: _coordinates.top.number,
								left: _coordinates.left.number,
							});

							onChange({
								top: _coordinates.top.number,
								left: _coordinates.left.number,
							});
						}}
					/>
				</div>

				<div style={{ width: '100%' }}>
					<Flex direction="column" gap="8px" justify="space-around">
						<InputField
							label={__('Top', 'publisher-core')}
							id={'top'}
							settings={{
								type: 'css',
								unitType: 'background-position',
							}}
							defaultValue={coordinates.top}
							onChange={(value) => {
								setCoordinates({
									...coordinates,
									top: value,
								});

								onChange({
									...coordinates,
									top: value,
								});
							}}
						/>

						<InputField
							label={__('Left', 'publisher-core')}
							id={'left'}
							settings={{
								type: 'css',
								unitType: 'background-position',
							}}
							//
							defaultValue={coordinates.left}
							onChange={(value) => {
								setCoordinates({
									...coordinates,
									left: value,
								});

								onChange({
									...coordinates,
									left: value,
								});
							}}
						/>
					</Flex>
				</div>
			</Flex>

			{children}
		</Field>
	);
}
