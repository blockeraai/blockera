/**
 * External dependencies
 */
import { __experimentalAlignmentMatrixControl as WPAlignmentMatrixControl } from '@wordpress/components';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { Field } from '@publisher/fields';
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import { convertAlignmentMatrixCoordinates } from './utils';
import { InputControl } from '../input-control';

export default function AlignmentMatrixControl({
	inputFields,
	size,
	//
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field,
	//
	className,
}) {
	const { value } = useControlContext({
		id,
		defaultValue,
		onChange,
	});

	if (!inputFields) {
		return (
			<Field
				label={label}
				field={field}
				columns={columns}
				className={className}
			>
				<div className={controlClassNames('alignment-matrix')}>
					<WPAlignmentMatrixControl
						className={controlClassNames('alignment-matrix-box')}
						value={
							convertAlignmentMatrixCoordinates(value)?.compact
						}
						width={size}
						onChange={(newValue) => {
							newValue =
								convertAlignmentMatrixCoordinates(newValue);

							onChange({
								top: newValue.top.number,
								left: newValue.left.number,
							});
						}}
					/>
				</div>
			</Field>
		);
	}

	return (
		<Field
			label={label}
			field={field}
			columns={columns}
			className={className}
		>
			<Flex
				gap="8px"
				direction="row"
				justify="space-around"
				className={controlClassNames('alignment-matrix')}
			>
				<div style={{ width: '75%' }}>
					<WPAlignmentMatrixControl
						className={controlClassNames('alignment-matrix-box')}
						value={
							convertAlignmentMatrixCoordinates(value)?.compact
						}
						width={size}
						onChange={(newValue) => {
							newValue =
								convertAlignmentMatrixCoordinates(newValue);

							onChange({
								top: newValue.top.number,
								left: newValue.left.number,
							});
						}}
					/>
				</div>

				<div style={{ width: '100%' }}>
					<Flex direction="column" gap="8px" justify="space-around">
						<InputControl
							id={'top'}
							label={__('Top', 'publisher-core')}
							type="css"
							unitType="background-position"
							defaultValue={value.top}
							onChange={(newValue) => {
								onChange({
									...value,
									top: newValue,
								});
							}}
						/>

						<InputControl
							id={'left'}
							label={__('Left', 'publisher-core')}
							type="css"
							unitType="background-position"
							defaultValue={value.left}
							onChange={(newValue) => {
								onChange({
									...value,
									left: newValue,
								});
							}}
						/>
					</Flex>
				</div>
			</Flex>
		</Field>
	);
}

AlignmentMatrixControl.propTypes = {
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.shape({
		top: PropTypes.string,
		left: PropTypes.string,
	}),
	/**
	 * If provided, sets the size (width and height) of the control.
	 *
	 * @default 68
	 */
	size: PropTypes.number,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Show advanced input fields for changing top and left position or not?
	 */
	inputFields: PropTypes.bool,
};

AlignmentMatrixControl.defaultProps = {
	defaultValue: {
		top: '50%',
		left: '50%',
	},
	size: 68,
	field: 'alignment-matrix',
	inputFields: false,
};

export { convertAlignmentMatrixCoordinates } from './utils';
