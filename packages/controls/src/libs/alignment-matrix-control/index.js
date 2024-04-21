// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';
import { Flex } from '@blockera/components';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { default as InputControl } from '../input-control';
import { useControlContext } from '../../context';
import { convertAlignmentMatrixCoordinates } from './utils';
import type { Props } from './types';
import type { MixedElement } from 'react';
import AlignmentMatrixBox from './components/alignment-matrix';

export default function AlignmentMatrixControl({
	inputFields = false,
	size = 68,
	//
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	columns,
	defaultValue = {
		top: '50%',
		left: '50%',
	},
	onChange,
	field = 'alignment-matrix',
	singularId,
	repeaterItem,
	//
	className,
}: Props): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelDescription,
		labelPopoverTitle,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	if (!inputFields) {
		return (
			<BaseControl
				columns={columns}
				controlName={field}
				className={className}
				{...labelProps}
			>
				<div className={controlClassNames('alignment-matrix')}>
					<AlignmentMatrixBox
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
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<Flex
				gap="8px"
				direction="row"
				justify="space-around"
				className={controlClassNames('alignment-matrix')}
			>
				<div style={{ width: '72px' }}>
					<AlignmentMatrixBox
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
							label={__('Top', 'blockera-core')}
							min={0}
							max={100}
							unitType="background-position"
							defaultValue={defaultValue.top}
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
							label={__('Left', 'blockera-core')}
							min={0}
							max={100}
							unitType="background-position"
							defaultValue={defaultValue.left}
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
