/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	AlignmentMatrixControl,
	convertAlignmentMatrixCoordinates,
} from '@publisher/controls';
import { HStack, VStack } from '@publisher/components';

/**
 * Internal dependencies
 */
import { Field, InputField } from '../../index';
import './style.scss';

export function PositionField({
	name,
	label = __('Position', 'publisher-core'),
	columns,
	className,
	options,
	//
	top,
	left,
	attributeTopField,
	attributeLeftField,
	onValueChange = () => {},
	onChangeAlignment = () => {},
	children,

	...props
}) {
	const [coordinates, setCoordinates] = useState({
		top,
		left,
	});

	return (
		<>
			<Field label={label} field="position" className={className}>
				<HStack spacing="2" justify="space-around">
					<div style={{ width: '75%' }}>
						<AlignmentMatrixControl
							value={
								convertAlignmentMatrixCoordinates(coordinates)
									?.compact
							}
							onChange={(newValue) => {
								const _coordinates =
									convertAlignmentMatrixCoordinates(newValue);

								setCoordinates(_coordinates);

								onChangeAlignment({
									[attributeTopField]:
										_coordinates.top.number,
									[attributeLeftField]:
										_coordinates.left.number,
								});
							}}
						/>
					</div>

					<div style={{ width: '100%' }}>
						<VStack spacing="2" justify="space-around">
							<InputField
								label={__('Top', 'publisher-core')}
								settings={{
									type: 'css',
									unitType: 'background-position',
								}}
								//
								initValue={coordinates.top}
								//
								{...props}
								onValueChange={(value) => {
									onValueChange(value, attributeTopField);
								}}
							/>

							<InputField
								label={__('Left', 'publisher-core')}
								settings={{
									type: 'css',
									unitType: 'background-position',
								}}
								//
								initValue={coordinates.left}
								//
								{...props}
								onValueChange={(value) => {
									onValueChange(value, attributeLeftField);
								}}
							/>
						</VStack>
					</div>
				</HStack>

				{children}
			</Field>
		</>
	);
}
