/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { Field } from '@publisher/fields';

/**
 * Publisher dependencies
 */
import { useControlContext } from '../../context';
import { InputControl, SelectControl, ColorControl } from '../index';
import BorderStyleHSolidIcon from './icons/style-h-solid';
import BorderStyleHDashedIcon from './icons/style-h-dashed';
import BorderStyleHDottedIcon from './icons/style-h-dotted';
import BorderStyleHDoubleIcon from './icons/style-h-double';
import BorderStyleVSolidIcon from './icons/style-v-solid';
import BorderStyleVDashedIcon from './icons/style-v-dashed';
import BorderStyleVDottedIcon from './icons/style-v-dotted';
import BorderStyleVDoubleIcon from './icons/style-v-double';

export default function BorderControl({
	linesDirection,
	customMenuPosition,
	style,
	//
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field,
	//
	className,
	// internal usage for stories
	__isWidthFocused,
	__isColorFocused,
	__isStyleFocused,
}) {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
	});

	return (
		<Field
			label={label}
			field={field}
			columns={columns}
			className={className}
		>
			<div
				className={controlClassNames('border', className)}
				style={style}
			>
				<InputControl
					min="0"
					unitType="custom"
					units={[{ value: 'px', label: 'PX', default: 0 }]}
					className={controlClassNames(
						'input',
						__isWidthFocused && 'is-focused'
					)}
					id="width"
					noBorder={true}
					onChange={(newValue) => {
						setValue({ ...value, width: newValue });
					}}
				/>

				<ColorControl
					type="minimal"
					noBorder={true}
					id="color"
					onChange={(newValue) => {
						setValue({ ...value, color: newValue });
					}}
					className={__isColorFocused && 'is-focus'}
				/>

				<SelectControl
					id="style"
					className={__isStyleFocused && 'is-focused'}
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
				/>
			</div>
		</Field>
	);
}

BorderControl.propTypes = {
	/**
	 * Indicates border-line icons direction
	 */
	linesDirection: PropTypes.oneOf(['horizontal', 'vertical']),
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
		width: PropTypes.string,
		style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
		color: PropTypes.string,
	}),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};

BorderControl.defaultProps = {
	field: 'border',
	linesDirection: 'horizontal',
	defaultValue: {
		width: '0px',
		style: 'solid',
		color: '',
	},
};
