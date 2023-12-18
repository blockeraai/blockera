// @flow
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
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { default as InputControl } from '../input-control';
import { useControlContext } from '../../context';
import { convertAlignmentMatrixCoordinates } from './utils';
import type { Props } from './types';
import type { MixedElement } from 'react';

export default function AlignmentMatrixControl({
	inputFields = false,
	size = 68,
	//
	id,
	label,
	columns,
	defaultValue = {
		top: '50%',
		left: '50%',
	},
	onChange,
	field = 'alignment-matrix',
	//
	className,
}: Props): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		description,
		resetToDefault,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	if (!inputFields) {
		return (
			<BaseControl
				label={label}
				columns={columns}
				controlName={field}
				className={className}
				{...{ attribute, blockName, description, resetToDefault }}
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

							setValue({
								top: newValue.top.number,
								left: newValue.left.number,
							});
						}}
					/>
				</div>
			</BaseControl>
		);
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<Flex
				gap="8px"
				direction="row"
				justify="space-around"
				className={controlClassNames('alignment-matrix')}
			>
				<div style={{ width: '72px' }}>
					<WPAlignmentMatrixControl
						className={controlClassNames('alignment-matrix-box')}
						value={
							convertAlignmentMatrixCoordinates(value)?.compact
						}
						width={size}
						onChange={(newValue) => {
							newValue =
								convertAlignmentMatrixCoordinates(newValue);

							setValue({
								top: newValue.top.number,
								left: newValue.left.number,
							});
						}}
					/>
				</div>

				<div style={{ width: 'calc(100% - 80px)' }}>
					<Flex direction="column" gap="8px" justify="space-around">
						<InputControl
							columns="columns-2"
							id={id === undefined ? 'top' : `${id}.top`}
							label={__('Top', 'publisher-core')}
							min={0}
							max={100}
							unitType="background-position"
							defaultValue={value.top}
							onChange={(newValue: Object) => {
								setValue({
									...value,
									top: newValue,
								});

								return newValue;
							}}
							size="small"
						/>

						<InputControl
							columns="columns-2"
							id={id === undefined ? 'left' : `${id}.left`}
							label={__('Left', 'publisher-core')}
							min={0}
							max={100}
							unitType="background-position"
							defaultValue={value.left}
							onChange={(newValue) => {
								setValue({
									...value,
									left: newValue,
								});

								return newValue;
							}}
							size="small"
						/>
					</Flex>
				</div>
			</Flex>
		</BaseControl>
	);
}

AlignmentMatrixControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
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
	defaultValue: (PropTypes.shape({
		top: PropTypes.string,
		left: PropTypes.string,
	}): { top: string, left: string }),
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

export { convertAlignmentMatrixCoordinates } from './utils';
