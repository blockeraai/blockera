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
	label = __('Position', 'publisher-core'),
	className,
	//
	topValue,
	leftValue,
	children,
	//
	onValueChange = () => {},
}) {
	const [coordinates, setCoordinates] = useState({
		top: topValue,
		left: leftValue,
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
							onValueChange={(newValue) => {
								const _coordinates =
									convertAlignmentMatrixCoordinates(newValue);

								setCoordinates({
									top: _coordinates.top.number,
									left: _coordinates.left.number,
								});

								onValueChange({
									top: _coordinates.top.number,
									left: _coordinates.left.number,
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
								value={coordinates.top}
								initValue={coordinates.top}
								onValueChange={(value) => {
									setCoordinates({
										...coordinates,
										top: value,
									});

									onValueChange({
										top: value,
									});
								}}
							/>

							<InputField
								label={__('Left', 'publisher-core')}
								settings={{
									type: 'css',
									unitType: 'background-position',
								}}
								//
								value={coordinates.left}
								initValue={coordinates.left}
								onValueChange={(value) => {
									setCoordinates({
										...coordinates,
										left: value,
									});

									onValueChange({
										left: value,
									});
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
