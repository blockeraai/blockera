/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	updateControlValue,
	getControlValue,
	AlignmentMatrixControl,
	convertAlignmentMatrixCoordinates,
} from '@publisher/controls';
import { HStack, VStack } from '@publisher/components';
import { BlockEditContext } from '@publisher/extensions';

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
	attributeTopField,
	attributeLeftField,
	repeaterAttribute,
	repeaterAttributeIndex,
	children,

	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	let attributeTopFieldValue = getControlValue(
		undefined,
		attributeTopField,
		repeaterAttribute,
		repeaterAttributeIndex,
		'50%',
		attributes
	);

	let attributeLeftFieldValue = getControlValue(
		undefined,
		attributeTopField,
		repeaterAttribute,
		repeaterAttributeIndex,
		'50%',
		attributes
	);

	return (
		<>
			{attributeTopField && attributeLeftField && (
				<Field label={label} field="position" className={className}>
					<HStack spacing="2" justify="space-around">
						<div style={{ width: '75%' }}>
							<AlignmentMatrixControl
								value={
									convertAlignmentMatrixCoordinates({
										top: attributeTopFieldValue,
										left: attributeLeftFieldValue,
									})?.compact
								}
								onChange={(newValue) => {
									let coordinates =
										convertAlignmentMatrixCoordinates(
											newValue
										);

									updateControlValue(
										coordinates.top.number,
										attributeTopField,
										repeaterAttribute,
										repeaterAttributeIndex,
										attributes,
										setAttributes
									);

									updateControlValue(
										coordinates.left.number,
										attributeLeftField,
										repeaterAttribute,
										repeaterAttributeIndex,
										attributes,
										setAttributes
									);
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
									initValue="0%"
									attribute={attributeTopField}
									repeaterAttributeIndex={
										repeaterAttributeIndex
									}
									repeaterAttribute={repeaterAttribute}
									//
									{...props}
								/>

								<InputField
									label={__('Left', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'background-position',
									}}
									//
									initValue="0%"
									attribute={attributeLeftField}
									repeaterAttributeIndex={
										repeaterAttributeIndex
									}
									repeaterAttribute={repeaterAttribute}
									//
									{...props}
								/>
							</VStack>
						</div>
					</HStack>

					{children}
				</Field>
			)}
		</>
	);
}
