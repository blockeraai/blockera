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
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { Field, InputField } from '../../index';

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
				<Flex gap="8px" direction="row" justify="space-around">
					<div style={{ width: '75%' }}>
						<AlignmentMatrixControl
							value={
								convertAlignmentMatrixCoordinates(coordinates)
									?.compact
							}
							onChange={(newValue) => {
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
						<Flex
							direction="column"
							gap="8px"
							justify="space-around"
						>
							<InputField
								label={__('Top', 'publisher-core')}
								settings={{
									type: 'css',
									unitType: 'background-position',
								}}
								//
								value={coordinates.top}
								defaultValue={coordinates.top}
								onChange={(value) => {
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
								defaultValue={coordinates.left}
								onChange={(value) => {
									setCoordinates({
										...coordinates,
										left: value,
									});

									onValueChange({
										left: value,
									});
								}}
							/>
						</Flex>
					</div>
				</Flex>

				{children}
			</Field>
		</>
	);
}
