// @flow

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import BorderStyleHSolidIcon from './icons/style-h-solid';
import BorderStyleVSolidIcon from './icons/style-v-solid';
import BorderStyleHDashedIcon from './icons/style-h-dashed';
import BorderStyleHDottedIcon from './icons/style-h-dotted';
import BorderStyleHDoubleIcon from './icons/style-h-double';
import BorderStyleVDashedIcon from './icons/style-v-dashed';
import BorderStyleVDottedIcon from './icons/style-v-dotted';
import BorderStyleVDoubleIcon from './icons/style-v-double';
import { InputControl, SelectControl, ColorControl } from '../index';
import type { BorderControlProps } from './types';

export default function BorderControl({
	linesDirection = 'horizontal',
	customMenuPosition,
	style, //
	id,
	label,
	columns,
	defaultValue = {
		width: '0px',
		style: 'solid',
		color: '',
	},
	onChange,
	field = 'border',
	className, // internal usage for stories
	__isWidthFocused,
	__isColorFocused,
	__isStyleFocused,
}: BorderControlProps): MixedElement {
	const {
		value,
		setValue,
		getId,
		attribute,
		blockName,
		description,
		resetToDefault,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
	});

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
			{...{ attribute, blockName, description, resetToDefault }}
		>
			<div
				className={controlClassNames('border', className)}
				style={style}
				data-test="border-control-component"
			>
				<InputControl
					id={getId(id, 'width')}
					type="number"
					min={0}
					defaultValue={defaultValue ? defaultValue.width : '0'}
					units={[
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
					]}
					className={controlClassNames(
						'input',
						__isWidthFocused && 'is-focused'
					)}
					noBorder={true}
					onChange={(newValue) => {
						setValue({ ...value, width: newValue });
					}}
					data-test="border-control-width"
					placeholder="0"
				/>

				<ColorControl
					id={getId(id, 'color')}
					type="minimal"
					noBorder={true}
					onChange={(newValue) => {
						setValue({ ...value, color: newValue });
					}}
					className={__isColorFocused && 'is-focused'}
					data-test="border-control-color"
					defaultValue={defaultValue && defaultValue.color}
				/>

				<SelectControl
					id={getId(id, 'style')}
					className={__isStyleFocused ? 'is-focused' : ''}
					customMenuPosition={customMenuPosition}
					type="custom"
					customInputCenterContent={true}
					customHideInputCaret={true}
					customHideInputLabel={true}
					noBorder={true}
					options={[
						{
							label: '',
							icon:
								linesDirection === 'horizontal' ? (
									<BorderStyleHSolidIcon />
								) : (
									<BorderStyleVSolidIcon />
								),
							value: 'solid',
							className: 'align-center',
						},
						{
							label: '',
							icon:
								linesDirection === 'horizontal' ? (
									<BorderStyleHDashedIcon />
								) : (
									<BorderStyleVDashedIcon />
								),
							value: 'dashed',
							className: 'align-center',
						},
						{
							label: '',
							icon:
								linesDirection === 'horizontal' ? (
									<BorderStyleHDottedIcon />
								) : (
									<BorderStyleVDottedIcon />
								),
							value: 'dotted',
							className: 'align-center',
						},
						{
							label: '',
							icon:
								linesDirection === 'horizontal' ? (
									<BorderStyleHDoubleIcon />
								) : (
									<BorderStyleVDoubleIcon />
								),
							value: 'double',
							className: 'align-center',
						},
					]}
					onChange={(newValue) => {
						setValue({ ...value, style: newValue });
					}}
					defaultValue={defaultValue && defaultValue.style}
				/>
			</div>
		</BaseControl>
	);
}

BorderControl.propTypes = {
	/**
	 * Indicates border-line icons direction
	 */
	// $FlowFixMe
	linesDirection: PropTypes.oneOf(['horizontal', 'vertical']),
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
	// $FlowFixMe
	defaultValue: PropTypes.shape({
		width: PropTypes.string,
		style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
		color: PropTypes.string,
	}),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};
